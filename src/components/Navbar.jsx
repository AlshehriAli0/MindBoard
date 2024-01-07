import React, { useState } from "react";
import { createPortal } from "react-dom";
import LogForm from "./LogForm";
import SignForm from "./SignForm";
import UserBtn from "./userBtn";

function Navbar({ fetchData, isAuthenticated, setIsAuthenticated }) {
  const [currentForm, setCurrentForm] = useState(null);

  const handleButtonClick = (form) => {
    setCurrentForm((prevForm) => (prevForm === form ? null : form));
  };

  const renderForm = () => {
    switch (currentForm) {
      case "login":
        return (
          <LogForm
            fetchData={fetchData}
            closeForm={() => setCurrentForm(null)}
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
          />
        );
      case "signup":
        return (
          <SignForm
            fetchData={fetchData}
            closeForm={() => setCurrentForm(null)}
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
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
      return <UserBtn />;
    }
  };

  return (
    <>
      <nav>
        <div className="flex justify-between h-16 px-10 shadow items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl text-gray-900 lg:text-2xl font-bold cursor-pointer">
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
    <div className="flex space-x-4 items-center">
      <button
        onClick={() => handleButtonClick("login")}
        className={`text-gray-800 bg-gray-200 px-5 py-2 border border-solid border-black rounded transition hover:bg-gray-900 hover:text-white duration-300 font-semibold text-sm ${
          currentForm === "login" ? "scale-110" : ""
        }`}
      >
        LOGIN
      </button>
      <button
        onClick={() => handleButtonClick("signup")}
        className={`text-white bg-gray-800 px-5 py-2 rounded transition hover:bg-gray-900 duration-300 font-semibold text-sm ${
          currentForm === "signup" ? "scale-110" : ""
        }`}
      >
        Sign Up
      </button>
    </div>
  );
}

export default Navbar;
