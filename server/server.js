import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";

const app = express();
const PORT = 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.static("build"));
app.use(express.json());

const notes = [{ content: "This is a note", id: 1, title: "Note 1" }];

// * Get Routes
app.get("/api/notes", (req, res) => {
  res.send(notes);
});

// * Post Routes
app.post("/api/login", (req, res) => {
  const { email, password, action } = req.body;
  console.log(`Email: ${email}, Password: ${password}, action: ${action}`);
  console.log({ message: "Login successful" });
});

app.post("/api/signUp", (req, res) => {
  const { name, email, password, action } = req.body;
  console.log(
    `name ${name}, Email: ${email}, Password: ${password}, action: ${action}`
  );
  console.log({ message: "Sign in successful" });
});

app.post("/api/createNote", (req, res) => {
  const { title, content } = req.body;
  const data = {
    content: content,
    title: title,
    id: notes.length + 1,
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
