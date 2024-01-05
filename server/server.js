import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Strategy as LocalStrategy } from "passport-local";
import  dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import User from "../src/userModels.js";


dotenv.config({ path: "../dev.env"});
const app = express();
const PORT = 8080;
const notes = [{ content: "This is a note", id: 1, title: "Note 1" }];

// * Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

// * Salting password algorithm
function getRandomSaltRounds(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const saltRounds = getRandomSaltRounds(
  Number(process.env.MIN),
  Number(process.env.MAX)
);

// * Middleware
app.use(express.static("build"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// * Passportjs

passport.use(
  new LocalStrategy(async function (email, password, done) {
    const user = await User.findOne({ email: email });
    if (!user) {
      return done(null, false, { message: "Incorrect email." });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: "Incorrect password." });
    }
    return done(null, user);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await User.findById(id);
  done(null, user);
});

// * Get Routes
app.get("/api/notes", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(notes);
  } else {
    res.status(401).send("Not authenticated");
  }
});

// * Post Routes
app.post("/api/login", passport.authenticate("local"), (req, res) => {
  console.log({ message: "Login successful" });
});

app.post("/api/signUp", async (req, res) => {
  const { name, email, password } = req.body;

  // *hashing password
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  // *creating new user and saving
  const newUser = new User({
    name: name,
    email: email,
    password: hashedPassword,
    id: uuidv4(),
  });

  try {
    await newUser.save();
    res.send({ message: "Sign up successful" });
  } catch (err) {
    res.status(500).send({ message: "Error signing up" });
  }
});

app.post("/api/createNote", (req, res) => {
  const { title, content } = req.body;
  const data = {
    content: content,
    title: title,
    id: uuidv4(),
  };
  notes.push(data);
  res.json({ message: "Note created", data: notes });
});

app.post("/api/deleteNote", (req, res) => {
  const { id } = req.body;
  const index = notes.findIndex((note) => note.id === id);
  notes.splice(index, 1);
  res.json({ message: "Note deleted", data: id });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
