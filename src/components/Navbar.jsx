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
        return <LogForm  />;
      case "signup":
        return <SignForm closeForm={(state)=>{
          setCurrentForm(state);
        }} />;
    
      default:
        return <></>;
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
                  MindBoard
                </h1>
              </div>
              <NavBtn
                handleButtonClicks={(form) => {
                  setCurrentForm((prevForm) => {
                    if (prevForm === form) {
                      return null; // Close the form if it's already open
                    } else {
                      return form; // Open the form
                    }
                  });
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
