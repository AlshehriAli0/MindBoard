import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Note from "./components/Note.jsx";
import CreateNote from "./components/createNote.jsx";
import axios from "axios";

function App() {
  // * hooks
  const [item, setItem] = useState([]);

  const fetchData = async () => {
    try {
      const result = await axios.get("/api/notes");
      setItem(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // * displayed content
  return (
    <>
      <Navbar></Navbar>
      <CreateNote fetchData={fetchData} />
      <Note dataFromApp={item} fetchData={fetchData}></Note>
      <Footer></Footer>
    </>
  );
}

export default App;
