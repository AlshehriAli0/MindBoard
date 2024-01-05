import React, { useState, useEffect } from "react";
import SignForm from "./SignForm";

function NavBtn({ handleButtonClicks }) {
  // * handle which form expand button for
  const [activeForm, setActiveForm] = useState(null);

  //* Function to handle button clicks
  const handleButtonClick = (form) => {
    if (activeForm !== form) {
      handleButtonClicks(form);
      setActiveForm(form);
    } else {
      handleButtonClicks("");
      setActiveForm("");
    }
  };
  useEffect(() => {
    console.log("NavBtn state updated:", activeForm);
  }, [activeForm]);
  // * rendered content
  return (
    <div className="flex space-x-4 items-center">
      <button
        onClick={() => {
          handleButtonClick("login");
        }}
        className={`text-gray-800 px-5 py-2 rounded transition hover:bg-gray-300 duration-300 font-semibold text-sm ${
          activeForm === "login" ? "scale-110" : ""
        }`}
      >
        LOGIN
      </button>

      <button
        id="logBtn"
        className={`bg-yellow-500 px-4 py-2 rounded text-white transition hover:bg-yellow-600 duration-300 font-semibold text-sm  ${
          activeForm === "signup" ? "scale-110" : ""
        }`}
        onClick={() => {
          handleButtonClick("signup");
        }}
      >
        SIGNUP
      </button>
    </div>
  );
}

export default NavBtn;
