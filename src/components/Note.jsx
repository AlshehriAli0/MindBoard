import React, { useState } from "react";
import axios from "axios";


function Card({ setUpdateMsg, setDeleteMsg, ...props }) {
  // * hooks
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.Title);
  const [editedContent, setEditedContent] = useState(props.Content);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      if (prev) {
        setEditedTitle(props.Title);
        setEditedContent(props.Content);
        setIsEditing(false);
      }
      return !prev;
    });
  };

  // * toggle editing
  const toggleEditing = () => {
    if (isEditing) {
      setEditedTitle(props.Title);
      setEditedContent(props.Content);
    }
    setIsEditing((prev) => !prev);
  };

  // * edit note
  const updateNote = async () => {
    // If the note hasn't been edited, exit edit mode and close the menu
    if (editedTitle === props.Title && editedContent === props.Content) {
      setIsMenuOpen(false);
      setIsEditing(false);
      return;
    }

    try {
      await axios.post(
        "/api/updateNote",
        {
          id: props.id,
          title: editedTitle,
          content: editedContent,
        },
        { withCredentials: true }
      );

      setIsMenuOpen(false);
      setIsEditing(false);
      props.fetchData();

      setUpdateMsg(true);
    } catch (error) {
      console.error(error);
    }

    setTimeout(() => {
      setUpdateMsg(false);
    }, 5000);
  };

  // * delete note
  const deleteNote = async (e) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      await axios.post(
        "/api/deleteNote",
        { id: props.id },
        { withCredentials: true }
      );
      setIsMenuOpen(false);

      setDeleteMsg(true);

      setTimeout(() => {
        props.fetchData();
      }, 200);

      setTimeout(() => {
        setDeleteMsg(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        className={`flex z-0 items-center justify-center relative animate-fade-down animate-duration-[1500ms] animate-delay-[250ms] animate-ease-out ${
          isDeleting ? "fade-out" : ""
        }`}
      >
        <div className="rounded-lg shadow-md bg-white p-4 w-full float-left h-48 relative animate-fade-left animate-duration-[1500ms] animate-delay-[250ms] animate-ease-out z-0">
          {isEditing ? (
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-2xl font-black mb-2 w-11/12 overflow-y-auto max-h-8 text-md z-0 whitespace-pre-line word-break-all focus:outline-none"
            />
          ) : (
            <h1 className="text-2xl font-bold mb-2 max-w-xs overflow-y-auto max-h-8 text-md z-0 whitespace-pre-line word-break-all">
              {props.Title}
            </h1>
          )}
          {isEditing ? (
            <textarea
              className="text-gray-600 max-w-xs w-9/12 overflow-y-auto max-h-32 text-md z-0 whitespace-pre-line word-break-all focus:outline-none"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            <p className="text-gray-600 max-w-xs overflow-y-auto max-h-36 text-md z-0 whitespace-pre-line word-break-all">
              {props.Content}
            </p>
          )}
          <div className="absolute right-0 top-0 md:mr-2 md:mt-2 mt-1 mr-1 z-50">
            <button
              className={`px-2 py-1 transition hover:bg-gray-200 ${
                isMenuOpen ? "bg-gray-200" : ""
              } duration-300 rounded`}
              onClick={toggleMenu}
            >
              <img
                src={`${process.env.PUBLIC_URL}/assets/more.png`}
                className="md:h-4 h-7 cursor-pointer"
                alt="menu"
              />
            </button>

            <div
              className={`absolute top-0 right-0 md:mt-8 mt-10 z-40 ${
                isMenuOpen ? "animate-fade-up" : " hidden"
              }  animate-duration-[200ms] animate-ease-out animate-normal bg-white border border-gray-200 rounded-md shadow-md`}
            >
              <button
                onClick={toggleEditing}
                className="flex w-full justify-center space-x-1 align-middle px-5 py-2 text-gray-800 hover:bg-gray-200 hover:text-black duration-200 focus:outline-none z-50"
              >
                <img
                  className={`h-4  ${
                    isEditing ? "h-6 rounded-full" : "pr-1 mt-0.5 "
                  }`}
                  src={
                    isEditing
                      ? `${process.env.PUBLIC_URL}/assets/cross.png`
                      : `${process.env.PUBLIC_URL}/assets/editing(1).png`
                  }
                  alt={isEditing ? "Cancel" : "Edit"}
                />
                {isEditing ? "Cancel" : "Edit"}
              </button>
              <hr className="w-9/12 mx-auto" />

              {isEditing && (
                <>
                  <button
                    className="flex w-full justify-center space-x-2 align-middle px-5 py-2 text-gray-800 hover:bg-gray-200 hover:text-black duration-200 focus:outline-none z-50 "
                    onClick={updateNote}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/diskette.png`}
                      alt="save"
                      className="h-4 mt-1"
                    />
                    <p>Save</p>
                  </button>
                  <hr className="w-9/12 mx-auto" />
                </>
              )}
              <button
                onClick={deleteNote}
                className="flex justify-center space-x-1 align-middle px-5 py-2 text-gray-800 hover:bg-gray-200 hover:text-black duration-200 focus:outline-none z-50"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/bin.png`}
                  alt="bin"
                  className="h-5"
                />
                <p className="">Delete</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function createCard(props) {
  return (
    <Card
      key={props.id}
      Title={props.title}
      Content={props.content}
      id={props.id}
      fetchData={props.fetchData}
      setDeleteMsg={props.setDeleteMsg}
      setUpdateMsg={props.setUpdateMsg}
    />
  );
}

function Note({setUpdateMsg, setDeleteMsg, ...props }) {
  const data = props.dataFromApp;

  return (
    <>
      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 lg:grid-cols-4 lg:w-5/6 w-11/12 mx-auto justify-self-center sm:pt-16 pt-6 z-0">
        {data.map((item) =>
          createCard({
            ...item,
            fetchData: props.fetchData,
            setDeleteMsg,
            setUpdateMsg,
          })
        )}
      </section>
    </>
  );
}

export default Note;
