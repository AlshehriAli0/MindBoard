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
import { customAlphabet } from "nanoid";
import path from "path";
import { v4 as uuidv4 } from "uuid";

dotenv.config({ path: "../dev.env" });

// * Variables
const nanoid = customAlphabet("1234567890", 25);
const app = express();
const PORT = 8080 || process.env.PORT;
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
    cookie: { maxAge: 60 * 60 * 1000 },
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

// * User schema
const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    id: String,
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// * Note schema
const NoteSchema = new Schema({
  title: String,
  content: String,
  id: String,
});

userSchema.plugin(passportLocalMongoose);

// * User model constructor
const User = mongoose.model("mindboard", userSchema);

// * Note model constructor
const Note = mongoose.model("Note", NoteSchema);

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
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// * Get Routes
app.get("/", (req, res) => {});

app.get("/api/logout", (req, res) => {});

app.get("/api/user", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ name: user.name, email: user.email, date: user.createdAt });
    console.log("user,", user.name, user.email, user.createdAt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/notes", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("notes");
    res.json(user.notes);
  } catch (err) {
    console.error("Error during notes retrieval:", err.message);
    res
      .status(500)
      .json({ message: "Error retrieving notes", error: err.message });
  }
});

// * Post Routes
app.post("/api/login", passport.authenticate("local"), (req, res) => {
  if (req.isAuthenticated()) {
    console.log("Login attempt successful");
    res.status(200).json({ authenticated: true, message: "Login successful" });
  } else {
    console.log("Login attempt unsuccessful");
    res.status(401).send({ authenticated: true, message: "Not authenticated" });
  }
});

app.post("/api/signUp", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Signup attempt:", name, email, password);

  // *hashing password
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  console.log("Hashed Password:", hashedPassword);
  console.log("compare:", bcrypt.compareSync(password, hashedPassword));

  // *creating new user and saving
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // *  saving
    const newUser = new User({ name, email, password: hashedPassword });
    newUser.createdAt = new Date();
    await newUser.save();

    // *logging in user automatically after signup
    req.login(newUser, (err) => {
      if (err) {
        console.error("Error during login after signup:", err.message);
        res
          .status(500)
          .json({ message: "Error signing up", error: err.message });
      } else {
        res
          .status(201)
          .json({ authenticated: true, message: "Sign up successful" });
      }
    });
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.status(500).json({ message: "Error signing up", error: err.message });
  }
});

app.post("/api/createNote", async (req, res) => {
  const { title, content } = req.body;
  let id = nanoid();
  try {
    const newNote = new Note({
      title,
      content,
      id: id,
    });
    await newNote.save();

    const user = await User.findById(req.user._id);
    user.notes.push(newNote);
    await user.save();

    res.status(201).json({ message: "Note created", data: newNote });
  } catch (err) {
    console.error("Error during note creation:", err.message);
    res
      .status(500)
      .json({ message: "Error creating note", error: err.message });
  }
});

app.post("/api/deleteNote", async (req, res) => {
  const { id } = req.body;

  try {
    await Note.findOneAndDelete({ id: id });
    res.json({ message: "Note deleted", data: id });
  } catch (err) {
    console.error("Error during note deletion:", err.message);
    res
      .status(500)
      .json({ message: "Error deleting note", error: err.message });
  }
});


// * server listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
