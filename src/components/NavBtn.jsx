import React, { useState } from "react";


function NavBtn({handleButtonClicks}) {
  // * handle which form to show
  const [activeForm, setActiveForm] = useState(null);

  // * rendered content
  return (
    <div className="flex space-x-4 items-center">
      <button
        className={`text-gray-800 px-5 py-2 rounded transition hover:bg-gray-300 duration-300 font-semibold text-sm ${
          activeForm === "login" ? "scale-105" : ""
        }`}
        onClick={() => handleButtonClicks("login")}
      >
        LOGIN
      </button>

      <button
        id="logBtn"
        className={`bg-yellow-500 px-4 py-2 rounded text-white transition hover:bg-yellow-600 duration-300 font-semibold text-sm  ${
          activeForm === "signup" ? "scale-105" : ""
        }`}
        onClick={() => handleButtonClicks("signup")}
      >
        SIGNUP
      </button>
    </div>
  );
}

export default NavBtn;
