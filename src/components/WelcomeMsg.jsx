import React, { useEffect, useState } from "react";

function WelcomeMsg({ msg }) {
  const [fadeDown, setFadeDown] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeDown(true);
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className=" animate-fade-left animate-duration-[500ms] animate-ease-out shadow-xl ">
      <div
        className={` fixed scale-90 mb-36 right-12 py-1 px-3 rounded-lg bg-white ${
          fadeDown ? " transition-opacity duration-200 ease-out opacity-0" : ""
        } flex justify-center items-center border-2 border-gray-800 space-x-1`}
      >
        <img
          src={`${process.env.PUBLIC_URL}/assets/hello.png`}
          alt="hand wave"
          className="h-8 inline-block rounded-lg"
        />
        <p className="font-semibold text-xl text-gray-900 pr-1">{msg}</p>
      </div>
    </div>
  );
}

export default WelcomeMsg;
