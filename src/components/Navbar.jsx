import React, { useState } from "react";
import { createPortal } from "react-dom";
import LogForm from "./LogForm";
import SignForm from "./SignForm";
import UserBtn from "./userBtn";

function Navbar({
  isAuthenticated,
  setIsAuthenticated,
  setWelcomeMsg,
  setSuccessMsg,
  setEmailSuccessMsg,
  setNameMsg,
  setInvalidName,
}) {
  const [currentForm, setCurrentForm] = useState(null);

  const handleButtonClick = (form) => {
    setCurrentForm((prevForm) => (prevForm === form ? null : form));
  };

  const renderForm = () => {
    switch (currentForm) {
      case "login":
        return (
          <LogForm
            closeForm={() => setCurrentForm(null)}
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            setWelcomeMsg={setWelcomeMsg}
            setNameMsg={setNameMsg}
          />
        );
      case "signup":
        return (
          <SignForm
            closeForm={() => setCurrentForm(null)}
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            setSuccessMsg={setSuccessMsg}
            setEmailSuccessMsg={setEmailSuccessMsg}
          />
        );
      default:
        return <></>;
    }
  };

  const renderNavBtn = () => {
    if (!isAuthenticated) {
      return (
        <NavBtn
          handleButtonClick={handleButtonClick}
          currentForm={currentForm}
          
        />
      );
    } else {
      return (
        <UserBtn
          setEmailSuccessMsg={setEmailSuccessMsg}
          setNameMsg={setNameMsg}
          setInvalidName={setInvalidName}
          setSuccessMsg={setSuccessMsg}
          setWelcomeMsg={setWelcomeMsg}
          
        />
      );
    }
  };

  return (
    <>
      <nav>
        <div className="flex justify-between h-16 md:px-10 px-4 shadow items-center">
          <div className="flex items-center space-x-2">
            <img
              src={`${process.env.PUBLIC_URL}/assets/board.png`}
              alt="board"
              className="h-8 animate-fade-right animate-duration-[1500ms] animate-delay-[600ms] animate-ease-out"
            />
            <h1 className="text-xl animate-fade-right animate-duration-[1500ms] animate-delay-[250ms] animate-ease-out text-gray-900 lg:text-2xl font-bold cursor-pointer">
              MindBoard
            </h1>
          </div>
          {renderNavBtn()}
          {createPortal(renderForm(), document.getElementById("root"))}

        </div>
      </nav>
    </>
  );
}

function NavBtn({ handleButtonClick, currentForm }) {
  return (
    <div className="flex space-x-2 sm:space-x-4 items-center">
      <button
        onClick={() => handleButtonClick("login")}
        className={`text-gray-800 animate-fade-left animate-duration-[1500ms] animate-delay-[250ms] animate-ease-out bg-gray-200 sm:px-5 sm:py-2 px-3 py-2 border border-solid border-gray-800 rounded transition hover:bg-gray-900 hover:text-white duration-300 font-semibold text-sm ${
          currentForm === "login" ? "scale-110" : ""
        }`}
      >
        LOGIN
      </button>
      <button
        onClick={() => handleButtonClick("signup")}
        className={`text-white animate-fade-left animate-duration-[1500ms] animate-delay-[550ms] animate-ease-out bg-gray-800 sm:px-5 sm:py-2 px-3 py-2 border border-solid border-gray-800 rounded transition hover:bg-gray-900 duration-300 font-semibold text-sm ${
          currentForm === "signup" ? "scale-110" : ""
        }`}
      >
        SignUp
      </button>
    </div>
  );
}

export default Navbar;
