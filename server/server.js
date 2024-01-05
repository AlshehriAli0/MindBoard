import express from "express";

const app = express();
const PORT = 8080;

app.use(express.static("build"));
app.use(express.json());

const notes = [
 
];


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
  const {name, email, password, action } = req.body;
  console.log(`name ${name}, Email: ${email}, Password: ${password}, action: ${action}`);
  console.log({ message: "Sign in successful" });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
