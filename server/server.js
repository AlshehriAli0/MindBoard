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
import cryptoRandomString from "crypto-random-string";
import { customAlphabet } from "nanoid";
import { fileURLToPath } from "url";
import { dirname } from "path";
import GoogleStrategy from "passport-google-oauth20";
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// * Variables
const nanoid = customAlphabet("1234567890", 25);
const app = express();
const PORT = process.env.PORT || 8080;
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

// * Validate first name
function validateFirstName(firstName) {
  if (!firstName.match(/^[a-zA-Z]+$/)) {
    return false;
  }
  return true;
}

// * Middleware
app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});
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
    verificationCode: String,
    isVerified: { type: Boolean, default: false },
    id: String,
    googleId: String,
    isNewUser: { type: Boolean, default: true },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// * Note schema
const NoteSchema = new Schema(
  {
    title: String,
    content: String,
    id: String,
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

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

// * local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        if (!user.isVerified) {
          return done(null, user, { message: "Verify account first." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// * google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://www.mindboard.live/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let firstName = profile.name.givenName;

        if (!validateFirstName(firstName)) {
          firstName = "User";
        }

        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          user.firstName = firstName;
          user.isNewUser = false;
          done(null, user);
        } else {
          user = await new User({
            googleId: profile.id,
            name: firstName,
            email: profile.emails[0].value,
            isNewUser: true,
          }).save();
          user.isNewUser = true;
          done(null, user);
        }
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// * Google auth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://www.mindboard.live/",
  }),
  async (req, res) => {
    try {
      const user = await req.user;

      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      req.login(user, (err) => {
        if (err) {
          return console.error(err);
        }
      });

      res.redirect(`https://www.mindboard.live/`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// * Get Routes
app.get("/", async (req, res) => {
  res.redirect("http://www.mindboard.live/");
});

app.get("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

app.get("/api/user", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      name: user.name,
      email: user.email,
      date: user.createdAt,
      isNewUser: user.isNewUser,
    });
    setImmediate(async () => {
      user.isNewUser = false;
      await user.save();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/notes", async (req, res) => {
  try {
    const sortOrder = req.query.sortOrder || "ascending";
    const sortDirection = sortOrder === "ascending" ? -1 : 1;

    const user = await User.findById(req.user._id).populate({
      path: "notes",
      options: { sort: { createdAt: sortDirection } },
    });

    res.json({ notes: user.notes });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving notes", error: err.message });
  }
});

// * Post Routes

app.post("/api/login", passport.authenticate("local"), async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user && !user.isVerified) {
    res.status(403).json({
      authenticated: false,
      verified: false,
      message: "User exists but isn't verified",
    });
    return;
  }
  if (req.isAuthenticated()) {
    res.status(200).json({ authenticated: true, message: "Login successful" });
    return;
  } else {
    res
      .status(401)
      .json({ authenticated: false, message: "Incorrect email or password" });
    return;
  }
});

app.post("/api/signUp", async (req, res) => {
  const { name, email, password } = req.body;

  // *hashing password
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  const authCode = cryptoRandomString({ length: 32 });

  // *creating new user and saving
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "Email already in use" });
    }
    console.log();
    // *  saving
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode: authCode,
    });
    newUser.createdAt = new Date();
    await newUser.save();

    // * send link

    res.status(201).json({ email, authCode });
  } catch (err) {
    console.error("Error during sign up:", err.message);
  }
});

app.get("/api/verifyAccount", async (req, res) => {
  const { email, token } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verificationCode !== token) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    user.isVerified = true;
    await user.save();

    EmailVerifySuccess(email);
    res.redirect("http://mindboard.live/");
  } catch (err) {
    console.error("Error verifying account:", err.message);
    res
      .status(500)
      .json({ message: "Error verifying account", error: err.message });
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
    res
      .status(500)
      .json({ message: "Error deleting note", error: err.message });
  }
});

app.post("/api/updateNote", async (req, res) => {
  const { id, title, content } = req.body;

  const filter = { id: id };
  const update = { title: title, content: content };
  try {
    const note = await Note.findOneAndUpdate(filter, update, { new: true });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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



async function EmailVerifySuccess(email) {
  const resend = new Resend(process.env.RESEND_API);

  await resend.emails.send({
    from: "MindBoard <Verify@mindboard.live>",
    to: email,
    subject: "Account Verification Success!",
    text: "Your account has been verified!",
  });
}

// * server listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
