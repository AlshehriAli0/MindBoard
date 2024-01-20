import React, { useEffect, useState } from "react";

function NoteMsg({ msg }) {
  const [fadeDown, setFadeDown] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeDown(true);
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className=" animate-fade-up animate-duration-[500ms] animate-ease-out shadow-xl ">
      <div
        className={` fixed scale-90 bottom-36 right-12 py-1 px-3 rounded-xl bg-white ${
          fadeDown ? " transition-opacity duration-200 ease-out opacity-0" : ""
        } flex justify-center items-center border-4 border-gray-800 space-x-1`}
      >
        <img
          src={`${process.env.PUBLIC_URL}/assets/check.png`}
          alt="hand wave"
          className="h-7 inline-block rounded-full opacity-80"
        />
        <p className="font-semibold text-lg text-gray-900 pr-1">{msg}</p>
      </div>
    </div>
  );
}

export default NoteMsg;
