import React from "react";

function Form(props) {
    const hideClass = props.hideClass;

    
  return (
    <div
      id="form-container"
      className={
        " absolute h-screen w-screen bg-gray-100 flex justify-center z-10 items-center bg-transparent " + hideClass
      }
    >
      <div className="py-6 md:mb-64 mb-40 px-8 h-80 bg-white rounded shadow-2xl">
        <form action="">
          <div className="mb-6">
            <label for="name" className="block text-gray-800 font-bold">
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="username"
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
            />
          </div>

          <div>
            <label for="email" className="block text-gray-800 font-bold">
              Email:
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="@email"
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
            />

            <a
              href="#"
              className="text-sm font-thin text-gray-800 hover:underline mt-2 inline-block hover:text-indigo-600"
            >
              Forget Password
            </a>
          </div>
          <butt className="cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded">
            Login
          </butt>
        </form>
      </div>
    </div>
  );
}

export default Form;
