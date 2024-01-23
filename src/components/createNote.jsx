import React, { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import SuccessMsg from "./SuccessMsg.jsx";
import DeleteMsg from "./DeleteMsg .jsx";
import WelcomeMsg from "./WelcomeMsg.jsx";
import UpdateMsg from "./UpdateMsg.jsx";
import { LineWave } from "react-loader-spinner";
import NoteMsg from "./NoteMsg";
import FailMsg from "./FailMsg";

function CreateNote({
  fetchData,
  isAuthenticated,
  welcomeMsg,
  deleteMsg,
  successMsg,
  nameMsg,
  emailSuccessMsg,
  updateMsg,
  invalidName,
}) {
  // * hooks
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNoteMsg, setShowNoteMsg] = useState(false);

  // * post request to server
  const handleNewNote = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const data = {
      title: title,
      content: content,
    };
    try {
      await axios
        .post("/api/createNote", data, {
          withCredentials: true,
        })
        .then(() => {
          setTitle("");
          setContent("");
          console.log(data);
          fetchData();

          // * show Note message
          setTimeout(() => {
            setShowNoteMsg(true);
          }, 1200);
        });
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);

    // * remove Note message
    setTimeout(() => {
      setShowNoteMsg(false);
    }, 3700);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-60 pl-10 z-50">
          <LineWave
            className=""
            visible={true}
            height="100"
            width="100"
            color="#ffffff"
            ariaLabel="line-wave-loading"
          />
        </div>
      )}
      {isAuthenticated ? (
        <form onSubmit={handleNewNote}>
          <div className="flex items-center justify-center w-screen pt-12">
            <div className="relative rounded-lg shadow-md bg-white float-left p-4 w-11/12 md:w-8/12 lg:5/12 xl:4/12 h-48 mb-6 animate-fade-up animate-duration-[1500ms] animate-delay-[250ms] animate-ease-out">
              <input
                required
                name="title"
                type="text"
                id="title"
                placeholder="Title...."
                className="focus:outline-none lg:text-2xl text-gray-800 font-bold mb-2 block w-full text-xl"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <textarea
                required
                name="content"
                type="text"
                id="content"
                placeholder="Content..."
                className="text-gray-800 focus:outline-none overflow-hidden overflow-y-auto max-h-32 lg:text-sm block w-full resize-none text-base"
                rows={6}
                wrap="soft"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />

              <button
                type="submit"
                className="absolute bottom-0 right-0 mr-2 mb-2 text-gray-800 animate-fade-left animate-duration-[1500ms] animate-delay-[600ms] animate-ease-out bg-transparent sm:px-5 sm:py-2 px-5 py-2 border border-solid border-gray-800 rounded transition hover:bg-gray-900 hover:text-white duration-300 scale-125 font-semibold text-lg"
                onClick={handleNewNote}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      ) : (
        <></>
      )}

      {/* //* Notifications */}

      {createPortal(
        <>
          <div className="pt-64 mt-80 md:mx-0 mx-12 ">
            {emailSuccessMsg && <UpdateMsg msg="Email Updated!" />}
            {nameMsg && <UpdateMsg msg="Name Updated!" />}
            {successMsg && <SuccessMsg msg="Sign Up Successful!" />}
            {deleteMsg && <DeleteMsg msg="Note Deleted!" />}
            {welcomeMsg && <WelcomeMsg msg="Welcome Back!" />}
            {showNoteMsg && <NoteMsg msg="Note Created " />}
            {updateMsg && <NoteMsg msg="Note Updated!" />}
            {invalidName && (
              <FailMsg msg="Invalid Name From Google. Please Update It In Your Account Settings!" />
            )}
          </div>
        </>,
        document.getElementById("portal-root")
      )}
    </>
  );
}

export default CreateNote;
