import React from "react";

function Account({ name, email, date }) {

    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString();

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black pointer-events-none bg-opacity-5 z-50 md:px-0 px-4">
        <div className="bg-white p-8 rounded-md text-center w-96 h-96 pointer-events-auto animate-fade-up animate-duration-[1500ms] animate-delay-[250ms] animate-ease-out">
          <h2 className="text-3xl font-bold mb-4">Account Information</h2>
          <div className="text-left">
            <p className="text-gray-800 font-semibold">
              <strong>Name:</strong> {name}
            </p>
            <p className="text-gray-800 font-semibold">
              <strong>Email:</strong> {email}
            </p>
            <p className="text-gray-800 font-semibold">
              <strong>Date Created:</strong> {formattedDate}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Account;
