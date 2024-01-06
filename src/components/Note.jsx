import React, { useState, useEffect } from "react";
import axios from "axios";

function Card(props) {
  const deleteNote = async () => {
    try {
      await axios.post("/api/deleteNote", { id: props.id } , { withCredentials: true });
      props.fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
