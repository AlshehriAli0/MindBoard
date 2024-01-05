import React, { useState } from "react";
import { createPortal } from "react-dom";
import LogForm from "./LogForm";
import SignForm from "./SignForm";

function Navbar() {
  const [currentForm, setCurrentForm] = useState(null);

  const handleButtonClick = (form) => {
    setCurrentForm((prevForm) => (prevForm === form ? null : form));
  };

  const renderForm = () => {
    switch (currentForm) {
      case "login":
        return <LogForm closeForm={() => setCurrentForm(null)} />;
      case "signup":
        return <SignForm closeForm={() => setCurrentForm(null)} />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <nav>
        <div className="flex justify-between h-16 px-10 shadow items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl text-gray-800 lg:text-2xl font-bold cursor-pointer">
              MindBoard
            </h1>
          </div>
          <NavBtn
            handleButtonClick={handleButtonClick}
            currentForm={currentForm}
          />
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
        className={`text-gray-800 bg-gray-200 px-5 py-2 rounded transition hover:bg-gray-300 duration-300 font-semibold text-sm ${
          currentForm === "login" ? "scale-110" : ""
        }`}
      >
        LOGIN
      </button>
      <button
        onClick={() => handleButtonClick("signup")}
        className={`bg-yellow-500 px-4 py-2 rounded text-white transition hover:bg-yellow-600 duration-300 font-semibold text-sm ${
          currentForm === "signup" ? "scale-110" : ""
        }`}
      >
        SIGNUP
      </button>
    </div>
  );
}

export default Navbar;
