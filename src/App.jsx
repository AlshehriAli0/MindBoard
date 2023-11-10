import React, { useState, useEffect } from "react";
import Header from "./componenets/Header.jsx";
import Footer from "./componenets/Footer.jsx";
import Note from "./componenets/Note.jsx";
import axios from "axios";

function App() {
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
  },[] );

  return (
    <div>
      <div>
        <Header></Header>
        <Note dataFromApp={item}></Note>
        <Footer></Footer>
      </div>
    </div>
  );
}

export default App;
