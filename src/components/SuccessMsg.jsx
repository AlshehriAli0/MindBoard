import React, { useEffect, useState } from "react";

function SuccessMsg({ msg }) {
  const [fadeDown, setFadeDown] = useState(false); 

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeDown(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className=" animate-fade-left animate-duration-[500ms] animate-ease-out shadow-xl ">
      <div
        className={` fixed scale-75 top-28 right-12 py-1 px-3 rounded-xl bg-white ${
          fadeDown ? " transition-opacity duration-200 ease-out opacity-0" : ""
        } flex justify-center items-center border-2 border-teal-500 space-x-1`}
      >
        <img
          src={`${process.env.PUBLIC_URL}/assets/exclamation-mark.png`}
          alt="exclamition mark"
          className="h-10 inline-block rounded-full"
        />
        <p className="font-semibold text-xl text-teal-700 pr-1">{msg}</p>
      </div>
    </div>
  );
}

export default SuccessMsg;
