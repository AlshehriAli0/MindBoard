import React, { useState } from "react";
import axios from "axios";
import { LineWave } from "react-loader-spinner";
import toast from "react-hot-toast";

function CreateNote({ setRefresh, isAuthenticated, setSortOrder, SortOrder }) {
  // * hooks
  const [title, setTitle] = useState(localStorage.getItem("title") || "");
  const [content, setContent] = useState(localStorage.getItem("content") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          setRefresh(true);

          // * show Note message
          toast.success("Note added!");
        });
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);

  };

  // * handle sort order change
  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setIsMenuOpen(false);
  };

  // * toggle menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  //* Whenever title or content changes, update localStorage
  React.useEffect(() => {
    localStorage.setItem("title", title);
  }, [title]);

  React.useEffect(() => {
    localStorage.setItem("content", content);
  }, [content]);

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
                autoComplete="off"
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
                className="absolute bottom-0 right-0 mr-2 mb-2 text-gray-800 animate-fade-left animate-duration-[1500ms] animate-delay-[600ms] animate-ease-out bg-transparent sm:px-5 sm:py-2 px-5 py-2 border border-solid border-gray-800 rounded transition hover:bg-gray-900 hover:text-white active:bg-black duration-300 scale-125 font-semibold text-lg"
                onClick={handleNewNote}
              >
                Submit
              </button>
              <button
                className={`px-2 py-1 transition active:bg-gray-500 hover:bg-gray-200 ${
                  isMenuOpen ? "bg-gray-200" : ""
                } duration-300 rounded absolute  right-0 top-0 md:mr-2 md:mt-2 mt-1 mr-1 z-50`}
                onClick={toggleMenu}
                type="button"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/sorting.png`}
                  className="md:h-6 h-8 cursor-pointer "
                  alt="menu"
                />
              </button>
              {isMenuOpen && (
                <div
                  className={`absolute top-3 right-0 md:mt-8 mt-10 z-40 ${
                    isMenuOpen ? "animate-fade-up" : " hidden"
                  }  animate-duration-[200ms] animate-ease-out animate-normal bg-white border border-gray-200 rounded-md shadow-md`}
                >
                  <button
                    type="button"
                    className={`flex w-full justify-start text-lg space-x-1  py-2 text-gray-900 hover:bg-gray-200 ${
                      SortOrder === "ascending" ? "bg-gray-200 font-bold" : ""
                    }`}
                    onClick={() => handleSortOrderChange("ascending")}
                  >
                    <img
                      alt="Ascending"
                      src={`${process.env.PUBLIC_URL}/assets/sortasc.png`}
                      className="h-6 pl-1"
                    ></img>
                    <p className="">Latest</p>
                  </button>
                  <hr className="w-9/12 mx-auto border-gray-400" />

                  <button
                    type="button"
                    className={`flex w-full  justify-start text-lg space-x-1 pr-4  py-2 text-gray-800 hover:bg-gray-200 ${
                      SortOrder === "descending" ? "bg-gray-200 font-bold" : ""
                    }`}
                    onClick={() => handleSortOrderChange("descending")}
                  >
                    <img
                      alt="Ascending"
                      src={`${process.env.PUBLIC_URL}/assets/sortdec.png`}
                      className="h-6 pl-1"
                    ></img>
                    <p>Oldest</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      ) : (
        <></>
      )}
    </>
  );
}

export default CreateNote;
