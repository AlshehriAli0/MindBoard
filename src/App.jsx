import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Note from "./components/Note.jsx";
import axios from "axios";

function App() {
  // * send data to Note.jsx
  const [item, setItem] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/api/notes");
        setItem(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  // * displayed content
  return (
    <>
        <Navbar></Navbar>
        <Note dataFromApp={item}></Note>
        <Footer></Footer>
    </>
  );
}

export default App;
