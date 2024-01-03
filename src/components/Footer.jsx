import React from "react";

function Footer() {
  const currentyear = new Date().getFullYear();
  return (
    <>
      <div className="container mx-auto text-center absolute bottom-0  align-middle">
        <hr />
        <div className="flex justify-center items-center h-16">
          <p className="text-gray-400  ">Copyright © {currentyear} </p>
        </div>
      </div>
    </>
  );
}

export default Footer;
