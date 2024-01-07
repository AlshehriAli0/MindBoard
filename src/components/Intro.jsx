import React from "react";

function Intro({ handleLoginSignup }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-8 rounded-md text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to Your App</h2>
        <p className="text-gray-600">
          Explore the features of our amazing app. Take notes, stay organized,
          and enhance your productivity!
        </p>
        <div className="mt-6 space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
            onClick={handleLoginSignup}
          >
            Login
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none"
            onClick={handleLoginSignup}
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default Intro;
