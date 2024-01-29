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
  const [refresh, setRefresh] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [welcomeMsg, setWelcomeMsg] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState(false);
  const [nameMsg, setNameMsg] = useState(false);
  const [updateMsg, setUpdateMsg] = useState(false);
  const [invalidName, setInvalidName] = useState(false);
  const [sortOrder, setSortOrder] = useState("ascending");

  // * fetch data from server
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(`/api/notes?sortOrder=${sortOrder}`, {
        withCredentials: true,
      });
      setItem(result.data.notes);

      result.status === 200
        ? setIsAuthenticated(true)
        : setIsAuthenticated(false);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);

    // * toggle refresh
    setRefresh(false);
  };

  useEffect(() => {
    fetchData();
  }, [sortOrder, isAuthenticated, refresh]);

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
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              setSuccessMsg={setSuccessMsg}
              setEmailSuccessMsg={setEmailSuccessMsg}
              setNameMsg={setNameMsg}
              setInvalidName={setInvalidName}
            />
            <Intro isAuthenticated={isAuthenticated} />

            <CreateNote
              setRefresh={setRefresh}
              isAuthenticated={isAuthenticated}
              emailSuccessMsg={emailSuccessMsg}
              nameMsg={nameMsg}
              successMsg={successMsg}
              deleteMsg={deleteMsg}
              welcomeMsg={welcomeMsg}
              updateMsg={updateMsg}
              invalidName={invalidName}
              setSortOrder={setSortOrder}
              SortOrder={sortOrder}
            />

            <Note
              dataFromApp={item}
              setRefresh={setRefresh}
              setDeleteMsg={setDeleteMsg}
              setUpdateMsg={setUpdateMsg}
            />
          </div>
          {isAuthenticated && <Footer item={item} />}
        </>
      )}
    </>
  );
}

export default App;
