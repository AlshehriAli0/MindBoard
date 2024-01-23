import React, { useEffect, useState } from "react";

function FailMsg({ msg }) {
  const [fadeDown, setFadeDown] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeDown(true);
    }, 4500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className=" animate-fade-left animate-duration-[500ms] animate-ease-out shadow-xl ">
      <div
        className={` fixed scale-75 top-0 right-0 py-1 px-3 rounded-lg bg-white ${
          fadeDown ? " transition-opacity duration-200 ease-out opacity-0" : ""
        } flex justify-center items-center border-2 border-red-500 space-x-1`}
      >
        <img
          src={`${process.env.PUBLIC_URL}/assets/exclamation-mark-red.png`}
          alt="exclamation mark"
          className="h-10 inline-block rounded-full"
        />
        <p className="font-semibold text-xl text-red-700 pr-1">{msg}</p>
      </div>
    </div>
  );
}

export default FailMsg;
