import React, { useState } from "react";
import NavBtn from "./NavBtn";
import LogForm from "./LogForm";
import SignForm from "./SignForm";
import { createPortal } from "react-dom";

function Navbar() {
  const [currentForm, setCurrentForm] = useState(null);

  //  * render form
  const renderForm = () => {
    switch (currentForm) {
      case "login":
        return <LogForm />;
      case "signup":
        return <SignForm />;
      default:
        return null;
    }
  };

  return (
    <>
      <header className="">
        <nav>
          <div className="">
            <div className="flex justify-between h-16 px-10 shadow items-center">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl lg:text-2xl font-bold cursor-pointer">
                  Tailwind
                </h1>
              </div>
              <NavBtn
                handleButtonClicks={(form) => {
                  setCurrentForm(form);
                }}
              />
              {createPortal(renderForm(), document.getElementById("root"))}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
