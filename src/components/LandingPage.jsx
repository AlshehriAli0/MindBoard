import React from "react";
import ScrambleText from "./ScrambleText";

function LandingPage({ handleGetStarted }) {
  const scrambledWords = [
    "THOUGHTS",
    "CREATIVITY",
    "INSIGHTS",
    "IMAGINATION",
    "INNOVATION",
    "REFLECTION",
    "IDEAS",
    "VISION",
  ];

  return (
    <>
      <div
        id="landing-container"
        className="w-screen min-h-screen bg-opacity-50"
        
      >
        <div
          id="landing-content"
          className="flex-inline justify-center text-center pt-40 md:pt-64 align-middle px-6"
        >
          <h1
            id="landing-title"
            className="sm:text-6xl text-5xl font-bold mb-4 animate-bounce align-middle"
          >
            Welcome to MindBoard
          </h1>
          <p
            id="landing-text"
            className="md:w-10/12 w-11/12 mx-auto md:text-3xl text-xl font-bold mb-8"
          >
            Elevate your{" "}
            <span className="text-orange-900 md:text-4xl text-2xl md:px-4 px-2 ">
              <ScrambleText words={scrambledWords} />
            </span>{" "}
            with MindBoard. Channel your creativity into organized, simple, and
            profound notes. Click below to get started.
          </p>
          <button
            onClick={() => {
              handleGetStarted();
            }}
            id="landing-btn"
            className="text-white bg-gray-800 px-9 py-3 rounded transition hover:bg-gray-900 duration-300 font-semibold text-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
