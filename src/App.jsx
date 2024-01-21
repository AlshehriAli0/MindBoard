import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Note from "./components/Note.jsx";
import CreateNote from "./components/createNote.jsx";
import LandingPage from "./components/LandingPage.jsx";
import Intro from "./components/Intro.jsx";

import { LineWave } from "react-loader-spinner";
import axios from "axios";

function App() {
  // * hooks
  const [item, setItem] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [welcomeMsg, setWelcomeMsg] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState(false);
  const [nameMsg, setNameMsg] = useState(false);

  // * fetch data from server
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get("/api/notes", {
        withCredentials: true,
      });
      setItem(result.data);
      console.log("Data fetched");
      console.log(isAuthenticated);
      result.status === 200
        ? setIsAuthenticated(true)
        : setIsAuthenticated(false);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGetStarted = () => {
    setShowLandingPage(false);
  };

  // * displayed content
  return (
    <>
      {isLoading && (
        <div className="w-screen h-screen flex justify-center bg-black bg-opacity-60 items-center fixed pl-10 z-50">
          <LineWave
            className=""
            visible={true}
            height="100"
            width="100"
            color="#ffffff"
            ariaLabel="line-wave-loading"
            wrapperStyle={{}}
            wrapperClass=""
            firstLineColor=""
            middleLineColor=""
            lastLineColor=""
          />
        </div>
      )}
      {showLandingPage && !isAuthenticated ? (
        <LandingPage handleGetStarted={handleGetStarted} />
      ) : (
        <>
          <div className="">
            <Navbar
              setWelcomeMsg={setWelcomeMsg}
              fetchData={fetchData}
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              setSuccessMsg={setSuccessMsg}
              setEmailSuccessMsg={setEmailSuccessMsg}
              setNameMsg={setNameMsg}
            />
            <Intro isAuthenticated={isAuthenticated} />

            <CreateNote
              fetchData={fetchData}
              isAuthenticated={isAuthenticated}
              emailSuccessMsg={emailSuccessMsg}
              nameMsg={nameMsg}
              successMsg={successMsg}
              deleteMsg={deleteMsg}
              welcomeMsg={welcomeMsg}
            />

            <Note
              dataFromApp={item}
              fetchData={fetchData}
              setDeleteMsg={setDeleteMsg}
            />

            {isAuthenticated && <Footer item={item} />}
          </div>
        </>
      )}
    </>
  );
}

export default App;
