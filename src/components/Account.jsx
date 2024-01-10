import React, { useState } from "react";
import axios from "axios";

function Account({ fetchData, name, email, date }) {
  // * hooks
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedEmail, setEditedEmail] = useState(email);

  // * toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // * format date
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString();

  const handleSaveChanges = async () => {
    // * POST request to update user data
    try {
      const response = await axios.post("/api/updateUser", {
        name: editedName,
        email: editedEmail,
      });

      if (response.status === 200) {
        setIsEditing(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-5 pointer-events-none md:px-0 px-4 z-50">
        <div className="bg-white p-8 rounded-md text-center w-96 h-96 pointer-events-auto animate-fade-up animate-duration-[1500ms] animate-delay-[250ms] animate-ease-out relative">
          <h2 className="text-3xl font-bold mb-4">Account Information</h2>
          <div className="text-left">
            <p className="text-gray-900 font-bold text-lg">
              <strong>Name:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full border border-gray-300 py-2 pl-3 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              ) : (
                name
              )}
            </p>
            <p className="text-gray-900 font-bold text-lg mt-1">
              <strong>Email:</strong>{" "}
              {isEditing ? (
                <input
                  type="text"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="w-full border border-gray-300 py-2 pl-3 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              ) : (
                email
              )}
            </p>
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
              className="mt-28 w-8/12 px-4 py-2 bg-transparent rounded transition hover:bg-gray-900 hover:text-white duration-300 border-2 border-gray-900 text-black"
              onClick={handleEditToggle}
            >
              Edit
            </button>
          )}
          <p className="absolute bottom-2 pl-2 ml-16 text-gray-400 font-semibold">
            <strong>Created On:</strong> {formattedDate}
          </p>
        </div>
      </div>
    </>
  );
}

export default Account;
