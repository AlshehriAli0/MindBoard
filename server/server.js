import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import LocalStrategy from "passport-local";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config({ path: "../dev.env" });

const app = express();
const PORT = 8080;
const monURL = process.env.MONGODB_URI.toString();
const Secret = process.env.SESSION_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN.toString();
const notes = [{ content: "This is a note", id: 1, title: "Note 1" }];


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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(
  session({
    secret: Secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// * Database connection
mongoose
  .connect(monURL)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    id: String,
  },
  { timestamps: true }
);
userSchema.plugin(passportLocalMongoose);

// * User model constructor
const User = mongoose.model("mindboard", userSchema);

// * Passportjs config
passport.use(User.createStrategy());
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new LocalStrategy(async function (email, password, done) {
    console.log("Login attempt:", email, password);
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

// * Get Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/notes", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(notes);
  } else {
    res.status(401).send("Not authenticated");
  }
});

// * Post Routes
app.post("/api/login", async (req, res, next) => {

  const { email, password } = req.body;
  console.log("Login attempt:", email, password);

  try {
    //* Find the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).send({ message: "User not found." });
    }

    //* Compare the entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compareSync(password, user.password);

    if (passwordMatch) {
      req.login(user, (err) => {
        if (err) return next(err);
        console.log("Login attempt:", email, password, "successful");
        return res.send({ message: "Login auth successful" });
      });
    } else {
      
      return res.status(401).send({ message: "Incorrect password." });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
});

app.post("/api/signUp", async (req, res) => {
  
  const { name, email, password } = req.body;
  console.log("Signup attempt:", name, email, password);

  // *hashing password
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  console.log("Hashed Password:", hashedPassword);
  console.log(
    "dehashed password:",
    bcrypt.compareSync(password, hashedPassword)
  );
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
    console.log("Signup successful");
  } catch (err) {
    console.error(
      "Error during signup:",
      err,
      err.message,
      "name:",
      name,
      "email:",
      email,
      "password:",
      password
    );
    res.status(500).json({ message: "Error signing up", error: err.message });
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
