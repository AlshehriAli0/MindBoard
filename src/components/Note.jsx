import React, { useState } from "react";
import { LineWave } from "react-loader-spinner";

import axios from "axios";

function Card(props) {
  const [isLoading, setIsLoading] = useState(false);

  const deleteNote = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(
        "/api/deleteNote",
        { id: props.id },
        { withCredentials: true }
      );
      props.fetchData();
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <div className="w-screen h-screen flex justify-center bg-black bg-opacity-60 items-center fixed z-50">
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
      )}{" "}
      <div className="flex items-center justify-center">
        <div className="rounded-lg shadow-md bg-white p-4 w-full float-left h-36">
          <h1 className="text-2xl font-bold mb-2">{props.Title}</h1>
          <p className="text-gray-500 md:w-54 w-80 overflow-hidden overflow-y-auto max-h-20 text-sm ">
            {props.Content}
          </p>
          <button
            onClick={deleteNote}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
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
