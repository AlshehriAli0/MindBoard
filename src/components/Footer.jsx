import React from "react";

function Footer({ item }) {
  const currentYear = new Date().getFullYear();
  return (
    <div
      className={`${
        item.length > 0 ? " mt-16 lg:mt-28 " : "mt-52 lg:mt-64"
      }  bottom-0 w-full text-center md:pt-0 pt-10 shadow-top shadow-lg`}
    >
      <hr className="w-full border-gray-400" />
      <div className="flex justify-center items-center h-16">
        <p className="text-gray-500 text-sm">
          © {currentYear} Ali Alshehri. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
