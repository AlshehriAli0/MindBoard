import React, { useState } from "react";
import axios from "axios";
import { LineWave } from "react-loader-spinner";

function Account({ toggleAccount, fetchData, name, email, date }) {
  // * hooks
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedEmail, setEditedEmail] = useState(email);
  const [isLoading, setIsLoading] = useState(false);

  // * toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };


  // * format date
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString();

  // * POST request to update user data
  const handleSaveChanges = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "/api/updateUser",
        {
          name: editedName,
          email: editedEmail,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsEditing(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <div className=" fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-60 z-50">
          <LineWave
            className=""
            visible={true}
            height="100"
            width="100"
            color="#ffffff"
            ariaLabel="line-wave-loading"
            wrapperStyle={{}}
            wrapperClass=""
            firstLineColor=""
            middleLineColor=""
            lastLineColor=""
          />
        </div>
      )}

      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 pointer-events-none md:px-0 px-4 z-50">
        <div className="bg-white p-8 rounded-md text-center w-96 h-96 pointer-events-auto animate-fade-up animate-duration-[500ms] animate-delay-[250ms] animate-ease-out relative">
          <img
            src={`${process.env.PUBLIC_URL}/assets/cross.png`}
            className="absolute top-4 right-4 h-10 cursor-pointer transition hover:bg-gray-100 duration-300 rounded-md"
            onClick={() => toggleAccount()}
            alt="Close Form"
          />
          <h2 className="text-3xl font-bold mb-4">Account Information</h2>
          <div className="text-left">
            <p className="text-gray-900 font-bold text-xl">Name</p>
            {isEditing ? (
              <input
                required
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full border-b-2 border-gray-700 py-2 pl-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent "
              />
            ) : (
              <p className="text-gray-900 text-lg pl-3 border-b-2 border-gray-500">
                {name}
              </p>
            )}
            <p className="text-gray-900 font-bold text-xl mt-5">Email</p>
            {isEditing ? (
              <input
                required
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="w-full border-b-2 border-gray-700 py-2 pl-3 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent "
              />
            ) : (
              <p className="text-gray-900 text-lg pl-3 border-b-2 border-gray-500">
                {email}
              </p>
            )}
          </div>
          {isEditing ? (
            <div className="flex space-x-2 absolute bottom-12 left-1/2 transform -translate-x-1/2">
              <button
                className="px-8 py-2 bg-gray-800 text-white rounded transition hover:bg-gray-900 duration-300 whitespace-nowrap"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                className="px-6  bg-transparent rounded transition hover:bg-gray-900 hover:text-white duration-300 border-2 border-gray-900 text-black"
                onClick={handleEditToggle}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="mt-10 w-8/12 px-4 py-2 bg-transparent rounded transition hover:bg-gray-900 hover:text-white duration-300 border-2 border-gray-900 text-black"
              onClick={handleEditToggle}
            >
              Edit
            </button>
          )}
          <p className="absolute bottom-2 pl-2 sm:ml-16 ml-12 text-gray-400 font-semibold">
            <strong>Created On:</strong> {formattedDate}
          </p>
        </div>
      </div>
    </>
  );
}

export default Account;
