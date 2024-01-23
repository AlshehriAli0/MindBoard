import React from "react";

function GoogleAuthButton({ msg }) {
  const handleGoogleAuth = () => {
    window.location.href = "https://mindboard.live/auth/google";
  };


  return (
    <button
      className="flex items-center justify-center space-x-2 text-gray-900 bg-white w-full px-5 py-2 border border-solid border-gray-900 rounded transition  hover:text-black active:translate-y-1 active:translate-x-1 hover:filter hover:invert duration-300 font-semibold text-sm  "
      onClick={handleGoogleAuth}
    >
      <img
        src={`${process.env.PUBLIC_URL}/assets/google.png`}
        className="h-5 "
        alt="Google Icon"
      />
      <p>{msg}</p>
    </button>
  );
}

export default GoogleAuthButton;
