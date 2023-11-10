import React from "react";


function createCard(props) {
  return <Card key={props.id} Title={props.title} Content={props.content} />;
}


function Card(props) {
  return (
    <div className="flex items-center justify-center">
      <div className="rounded-lg shadow-md bg-white p-4 w-full  float-left h-36">
        <h1 className="text-2xl font-bold mb-2">{props.Title}</h1>
        <p className="text-gray-500 w-54  text-sm ">{props.Content}</p>
      </div>
    </div>
  );
}


function Note(props) {
  const data = props.dataFromApp;
  return (
    <section
      className="grid sm:grid-col-2 md:grid-cols-3 gap-5  lg:grid-cols-4 lg:w-5/6
      w-11/12 mx-auto justify-self-center sm:pt-16
    pt-6"
    >
      {data.map(createCard)}
    </section>
  );
}

export default Note;
