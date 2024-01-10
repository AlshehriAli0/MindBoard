import React from "react";

function Intro({ isAuthenticated }) {
  return (
    <>
      {!isAuthenticated && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-5 pointer-events-none  md:px-0 px-4">
        <div className="bg-white p-8 rounded-md text-center  pointer-events-auto animate-fade-up animate-duration-[1500ms] animate-delay-[250ms] animate-ease-out">
          <h2 className="text-3xl font-bold mb-4">
            Get Started With MindBoard! 🚀
          </h2>
          <p className="text-gray-800 font-semibold">
            Explore the features of our amazing app. Take notes, stay organized,
            never forget tasks or ideas and enhance your productivity! ✨📝
          </p>
        </div>
      </div>)}
    </>
  );
}

export default Intro;
