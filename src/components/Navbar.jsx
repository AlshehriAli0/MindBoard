import React, { useState } from "react";
import Log  from "./Log";
import Form from "./Form";

function Navbar() {
  const [isLogVisible, setLogVisible] = useState(false);

  const toggleLogVisibility = () => {
    setLogVisible(!isLogVisible);
  };

  return (
    <header className="">
      <nav>
        <div className="">
          <div className="flex justify-between h-16 px-10 shadow items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl lg:text-2xl font-bold cursor-pointer">
                Tailwind
              </h1>
            </div>
            <Log onClick={toggleLogVisibility} />
          </div>
        </div>
      </nav>
      <Form hideClass={isLogVisible ? "" : "hidden"} />
    </header>
  );
}

export default Navbar;
