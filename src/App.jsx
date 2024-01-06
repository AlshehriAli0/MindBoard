import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Note from "./components/Note.jsx";
import CreateNote from "./components/createNote.jsx";
import axios from "axios";

function App() {
  // * hooks
  const [item, setItem] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // * fetch data from server
  const fetchData = async () => {
    try {
      const result = await axios.get("/api/notes", { withCredentials: true });
      setItem(result.data);
      console.log("Data fetched");
      console.log(isAuthenticated);
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
      <Navbar
        fetchData={fetchData}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      ></Navbar>
      <CreateNote fetchData={fetchData} />
      <Note dataFromApp={item} fetchData={fetchData}></Note>
      <Footer></Footer>
    </>
  );
}

export default App;
