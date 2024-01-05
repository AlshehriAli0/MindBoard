import React, { useState } from "react";
import axios from "axios";

function LogForm({ closeForm }) {
  // * hooks
  const [showPassword, setShowPassword] = useState(false);
  const [isFocusedE, setFocusedE] = useState(false);
  const [isFocusedP, setFocusedP] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // * post request to server
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      action: "login",
      email: email,
      password: password,
    };
    console.log(data);
    try {
      const response = await axios.post("/api/login", data);
      console.log(response.data);

      // * clear form
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      id="form-container"
      className={
        "flex items-center  mx-auto bg-gray-100 z-10 h-0 w-80 sm:w-96 bg-transparent animate-duration-[600ms] animate-fade-down animate-ease-out"
      }
    >
      <img
        src={`${process.env.PUBLIC_URL}/assets/cross.png`}
        className="absolute md:h-8 h-10 space-y-12 right-4 bottom-44 md:bottom-56 mt-24 cursor-pointer transition hover:bg-gray-100 duration-300 rounded-md"
        onClick={() => closeForm("")}
        alt="Close Form"
      ></img>
      <div className="py-6 align-middle pt-10 md:mb-64 mb-40 w-96 px-8 h-80 bg-white rounded shadow-2xl">
        <label className="relative font-bold text-2xl bottom-2 left-24 sm:left-32">
          Log In
        </label>
        <form action="/" method="post" id="loginForm" onSubmit={handleSubmit}>
          {/* //* Email */}
          <div className="mb-6 relative">
            <label
              htmlFor="email"
              className={`absolute left-2 top-4 text-gray-500 font-semibold text-md transition-transform bg-white px-2 ${
                isFocusedE || email ? "transform -translate-y-6 scale-75" : ""
              }`}
            >
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              id="email"
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onFocus={() => setFocusedE(true)}
              onBlur={() => setFocusedE(false)}
            />{" "}
          </div>

          {/* //* Password */}
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className={`absolute left-2 top-4 text-gray-500 font-semibold text-md transition-transform bg-white px-2 ${
                isFocusedP || password
                  ? "transform -translate-y-6 scale-75"
                  : ""
              }`}
            >
              Password
            </label>
            <input
              minLength={6}
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder=""
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
              value={password.length > 6 ? password : null}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onFocus={() => setFocusedP(true)}
              onBlur={() => setFocusedP(false)}
            />

            <img
              src={
                showPassword
                  ? `${process.env.PUBLIC_URL}/assets/hide.png`
                  : `${process.env.PUBLIC_URL}/assets/eye.png`
              }
              alt={showPassword ? "Show Password" : "Hide Password"}
              className="opacity-50 p-1 absolute right-1.5 top-3.5 align-middle rounded-full transition hover:bg-gray-100 duration-500 text-gray-500 cursor-pointer h-8 img"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <button
            type="submit"
            form="loginForm"
            className="cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LogForm;
