import React from "react";

// function logbtn() {
//          const Lbtn = document.getElementById("logBtn");
//          if(Lbtn.classList.contains("Hidden")){
//             Lbtn.classList.remove("Hidden");
//       } else {
//             Lbtn.classList.add("Hidden");
//       }}

function Header() {
  return (
    <header className="">
      <nav>
        <div className="">
          <div className="flex justify-between h-16 px-10 shadow items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl lg:text-2xl font-bold cursor-pointer">
                Tailwind
              </h1>
              <div className="hidden md:flex justify-around space-x-4">
                <a
                  href="#"
                  className="transition hover:text-yellow-500 duration-300 text-gray-700 font-semibold"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="transition hover:text-yellow-500 duration-300 text-gray-700 font-semibold"
                >
                  About
                </a>
                <a
                  href="#"
                  className="transition hover:text-yellow-500 duration-300 text-gray-700 font-semibold"
                >
                  Service
                </a>
                <a
                  href="#"
                  className="transition hover:text-yellow-500 duration-300 text-gray-700 font-semibold"
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="flex space-x-4 items-center">
              <a href="#" className="text-gray-800 text-sm">
                LOGIN
              </a>
              {/* onClick={logbtn()} */}
              <a
                id="logBtn"
                href="#"
                className="bg-yellow-500 px-4 py-2 rounded text-white transition hover:bg-yellow-600 duration-300 text-sm"
              >
                SIGNUP
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div
        id="button-container"
        className="h-screen bg-gray-100 flex justify-center hidden"
      >
        <div className="py-6 px-8 h-80 mt-20 bg-white rounded shadow-xl">
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
    </header>
  );
}

export default Header;
