import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passportLocalMongoose from "passport-local-mongoose";
import LocalStrategy from "passport-local";
import dotenv from "dotenv";
import path from "path";
import { customAlphabet } from "nanoid";


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// * Variables
const nanoid = customAlphabet("1234567890", 25);
const app = express();
const PORT = 8080 || process.env.PORT;
const monURL = process.env.MONGODB_URI.toString();
const Secret = process.env.SESSION_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN.toString();


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
    store: MongoStore.create({ mongoUrl: monURL }),
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
const User = mongoose.model("users", userSchema);

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

app.get("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

app.get("/api/user", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ name: user.name, email: user.email, date: user.createdAt });
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
    ;
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
  console.log("Signup attempt:", name, email);

  // *hashing password
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  // *creating new user and saving
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "Email already in use" });
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

app.post("/api/updateUser", async (req, res) => {
  const { name, email } = req.body;

  // * updating user
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return res.status(401).json({ message: "Email already in use" });
      }

      user.email = email;
    }

    if (name && name !== user.name && name.trim() !== "") {
      user.name = name;
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
});

// * server listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
