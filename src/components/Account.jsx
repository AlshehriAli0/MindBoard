import React, { useState } from "react";
import axios from "axios";
import { LineWave } from "react-loader-spinner";

function Account({
  toggleAccount,
  name,
  email,
  date,
  setEmailSuccessMsg,
  setNameMsg,
}) {
  // * hooks

  const [isEditing, setIsEditing] = useState(false);
  const [initialName, setInitialName] = useState(name);
  const [initialEmail, setInitialEmail] = useState(email);
  const [editedName, setEditedName] = useState(name);
  const [editedEmail, setEditedEmail] = useState(email);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // * toggle edit mode
  const handleEditToggle = () => {
    // * reset edited values when user cancels edit
    if (isEditing) {
      setEditedName(initialName);
      setEditedEmail(initialEmail);
    }
    setIsEditing(!isEditing);
  };

  // * Email validation function
  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  // * format date
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString();

  // * save changes
  const handleSaveChanges = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    //* Validate email before sending the request
    if (!validateEmail(editedEmail)) {
      setErrorMessage("Invalid email address!");
      setIsLoading(false);
      return;
    }

    // * Check if user has made any changes

    if (editedName === "User") {
      setErrorMessage("Please Change The Default Name!");
      setIsLoading(false);
    } else if (editedName === "User" || editedName === "user") {
      setErrorMessage("Please Change The Default Name!");
      setIsLoading(false);
    } else if (editedName === initialName && editedEmail === initialEmail) {
      setErrorMessage("No Changes Made");
      setIsEditing(false);
      setIsLoading(false);
    } else {
      // * POST request to update user data
      try {
        const response = await axios.post(
          "/api/updateUser",
          {
            name: editedName,
            email: editedEmail.toLowerCase(),
          },
          { withCredentials: true }
        );

        if (response.status === 200) {
          setIsEditing(false);

          // * set success message
          if (editedName !== initialName) {
            setTimeout(() => {
              setNameMsg(true);
            }, 400);
          }
          if (editedEmail !== initialEmail) {
            setTimeout(() => {
              setEmailSuccessMsg(true);
            }, 400);
          }

          //* Update initial values
          setInitialName(editedName);
          setInitialEmail(editedEmail);

          setErrorMessage("");
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrorMessage("Email already in use!");
        } else {
          setErrorMessage("Error updating data, please try again later!");
        }

        setIsLoading(false);
      }
    }

    setTimeout(() => {
      setEmailSuccessMsg(false);
    }, 6000);

    setTimeout(() => {
      setNameMsg(false);
    }, 6000);

    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <div className=" fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-60 pl-10 z-50">
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

      <div
        className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20 pointer-events-none 
      md:px-0 px-4 z-40"
      >
        <div className="bg-white sm:mb-0 mb-28 p-8 rounded-md text-center w-96 h-96 pointer-events-auto animate-fade-up animate-duration-[500ms] animate-delay-[250ms] animate-ease-out relative">
          <img
            src={`${process.env.PUBLIC_URL}/assets/cross.png`}
            className="absolute top-4 right-4 h-10 cursor-pointer transition hover:bg-gray-100 duration-300 rounded-md"
            onClick={() => toggleAccount()}
            alt="Close Form"
          />
          {errorMessage && (
            <div className="text-red-500 text-sm absolute bottom-6 z-40">
              {errorMessage}
            </div>
          )}
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
                name="email"
                id="email"
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
                disabled={editedName === "" || editedEmail === ""}
              >
                Save Changes
              </button>
              <button
                className="px-6  bg-transparent rounded transition hover:bg-gray-900 hover:text-white duration-300 border-2 border-gray-900 text-black"
                onClick={handleEditToggle}
                disabled={editedName === "User" || editedName === "user"}
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
          <p className="absolute bottom-0 pl-2 sm:ml-16 ml-12 text-gray-400 font-semibold">
            <strong>Created On:</strong> {formattedDate}
          </p>
        </div>
      </div>
    </>
  );
}

export default Account;
