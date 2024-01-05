import React, { useState } from "react";
import axios from "axios";

function CreateNote({ fetchData }) {
  // * hooks
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // * post request to server
  const handleNewNote = async (event) => {
    event.preventDefault();
    const data = {
      title: title,
      content: content,
    };
    try {
      await axios.post("/api/createNote", data).then(() => {
        setTitle("");
        setContent("");
        console.log(data);
        fetchData();
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleNewNote}>
      <div className="flex items-center justify-center w-screen pt-12">
        <div className="rounded-lg shadow-md bg-white float-left p-4 w-11/12 md:w-8/12 lg:5/12 xl:4/12 h-48">
          <input
            required
            name="title"
            type="text"
            id="title"
            placeholder="Title...."
            className="focus:outline-none text-2xl text-gray-800 font-bold mb-2 block w-full"
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
            className="text-gray-800 focus:outline-none overflow-hidden overflow-y-auto max-h-32 text-sm block w-full resize-none"
            rows={6}
            wrap="soft"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </div>
        <button type="submit" className="" onClick={handleNewNote}>
          ferggeregrgr
        </button>
      </div>
    </form>
  );
}

export default CreateNote;
