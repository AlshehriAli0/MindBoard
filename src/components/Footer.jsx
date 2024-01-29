import React from "react";

function Footer({ item }) {
  const currentYear = new Date().getFullYear();
  return (
    <div
      className={`${
        item.length > 0 ? " mt-28 lg:mt-28  " : " mt-44 lg:mt-64"
      } 
      sm:fixed sm:backdrop-blur-md bottom-0 w-full text-center md:pt-0 pt-10 shadow-top shadow-lg footer`}
    >
      <hr className="w-full border-gray-400" />
      <div className="flex justify-between sm:px-8 px-5 items-center h-16">
        <p className="text-gray-500 text-sm text-left">
          © {currentYear}{" "}
          <span className="font-bold text-gray-600 hover:text-gray-900">
            MindBoard by Ali Alshehri.{" "}
          </span>{" "}
          <span className="block sm:inline"> All rights reserved.</span>
        </p>
        <a
          href="https://github.com/AlshehriAli0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="Github Icon"
            src={`${process.env.PUBLIC_URL}/assets/github(1).png`}
            className="h-9 opacity-40 cursor-pointer hover:opacity-80 transition duration-300 ease-in-out"
          />
        </a>
      </div>
    </div>
  );
}

export default Footer;
