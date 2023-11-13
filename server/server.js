import express from "express";

const app = express();
const PORT = 8080;

app.use(express.static("build"));

const notes = [
  { title: "Note Title", content: "Note Content", id: 1 },
  { title: "Note Title2", content: "Note Content2", id: 2 },
  { title: "Note Title3", content: "Note Content3", id: 3 },
  {
    title: "Note Title45",
    content: "Note Content45",
    id: 4,
  },
];

app.get("/api/notes", (req, res) => {
  res.send(notes);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
