import React, { useState } from "react";

function Log({ onClick }) {
  const [loginClicked, setLoginClicked] = useState(false);
  const [signupClicked, setSignupClicked] = useState(false);

  const handleLoginClick = () => {
    setLoginClicked(true);
    onClick();

    setTimeout(() => {
      setLoginClicked(false);
    }, 90);
  };

  const handleSignupClick = () => {
    setSignupClicked(true);
    onClick();

    setTimeout(() => {
      setSignupClicked(false);
    }, 90);
  };

  return (
    <div className="flex space-x-4 items-center">
      <button
        className={`text-gray-800 px-5 py-2 rounded transition hover:bg-gray-300 duration-300 font-semibold text-sm ${
          loginClicked ? "scale-105" : ""
        }`}
        onClick={handleLoginClick}
      >
        LOGIN
      </button>

      <button
        id="logBtn"
        className={`bg-yellow-500 px-4 py-2 rounded text-white transition hover:bg-yellow-600 duration-300 font-semibold text-sm ${
          signupClicked ? "scale-105" : ""
        }`}
        onClick={handleSignupClick}
      >
        SIGNUP
      </button>
    </div>
  );
}

export default Log ;
