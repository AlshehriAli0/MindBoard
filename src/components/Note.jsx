import React, { useState } from "react";
import { LineWave } from "react-loader-spinner";
import axios from "axios";

function Card(props) {
  // * hooks
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // * delete note
  const deleteNote = async (e) => {
    e.preventDefault();
    setIsDeleting(true);

    setTimeout(async () => {
      setIsLoading(true);

      try {
        await axios.post(
          "/api/deleteNote",
          { id: props.id },
          { withCredentials: true }
        );
        setIsMenuOpen(false);
        props.fetchData();
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    }, 500); 
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
            wrapperStyle={{}}
            wrapperClass=""
            firstLineColor=""
            middleLineColor=""
            lastLineColor=""
          />
        </div>
      )}
      <div
        className={`flex items-center justify-center relative animate-fade-down animate-duration-[1500ms] animate-delay-[250ms] animate-ease-out ${
          isDeleting ? "fade-out" : ""
        }`}
      >
        <div className="rounded-lg shadow-md bg-white p-4 w-full float-left h-48 relative animate-fade-left animate-duration-[1500ms] animate-delay-[250ms] animate-ease-out z-0">
          <h1 className="text-2xl font-bold mb-2 max-w-xs overflow-y-auto max-h-8 text-md z-0 whitespace-pre-line word-break-all">
            {props.Title}
          </h1>
          <p className="text-gray-600 max-w-xs overflow-y-auto max-h-36 text-md z-0 whitespace-pre-line word-break-all">
            {props.Content}
          </p>
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
                onClick={deleteNote}
                className="flex justify-center space-x-1 align-middle px-5 py-2 text-gray-800 hover:bg-gray-200 focus:outline-none z-50"
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
    />
  );
}

function Note(props) {
  const data = props.dataFromApp;

  return (
    <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 lg:grid-cols-4 lg:w-5/6 w-11/12 mx-auto justify-self-center sm:pt-16 pt-6">
      {data.map((item) => createCard({ ...item, fetchData: props.fetchData }))}
    </section>
  );
}

export default Note;
