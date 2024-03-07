import React, { useState } from "react";
import axios from "axios";
import GoogleAuthButton from "./GoogleAuthButton";
import { LineWave } from "react-loader-spinner";
import { passwordStrength } from "check-password-strength";
import toast from "react-hot-toast";

function SignForm({ closeForm, setIsAuthenticated }) {
  // * password options
  const passwordOptions = JSON.parse(process.env.REACT_APP_PASSWORD_OPTIONS);

  // * hooks
  const [showPassword, setShowPassword] = useState(false);
  const [isFocusedE, setFocusedE] = useState(false);
  const [isFocusedP, setFocusedP] = useState(false);
  const [isFocusedN, setFocusedN] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // * capitalize first letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  // * post request to server
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    //* Check if name contains only letters
    if (!/^[a-zA-Z]+$/.test(name)) {
      setErrorMessage("Name must contain only letters");
      setIsLoading(false);
      return;
    }

    // * Check if password is safe
    if (
      passwordStrength(password, passwordOptions).value === "Too weak" ||
      passwordStrength(password, passwordOptions).value === "Weak"
    ) {
      setErrorMessage(
        `The password is ${passwordStrength(password, passwordOptions).value}! `
      );
      setIsLoading(false);
      return;
    }

    const data = {
      name: capitalizeFirstLetter(name),
      email: email.toLowerCase(),
      password: password,
    };

    // * post request to server
    try {
      await axios
        .post("/api/signUp", data, {
          withCredentials: true,
        })
        .then((response) => {
          // * clear form
          setName("");
          setEmail("");
          setPassword("");

          //* close form
          closeForm("");

          toast.success("Confirmation Link Sent on email!");


          if (response.data.authenticated) {
            setIsAuthenticated(true);
          }
        });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Email already in use!");
      } else {
        setErrorMessage(
          "An error occurred during Sign Up. Please try again later."
        );
      }
      console.error(error);
    }
    setIsLoading(false);

    
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
        id="form-container"
        className={
          "flex sm:mt-56 mt-80 items-center mx-auto bg-gray-100 z-10 h-0 w-80 sm:w-96 bg-transparent animate-duration-[600ms] animate-fade-down animate-ease-out"
        }
      >
        <img
          src={`${process.env.PUBLIC_URL}/assets/cross.png`}
          className="absolute md:h-8 h-10 space-y-12 right-4 bottom-52 md:bottom-64 mt-24 cursor-pointer transition hover:bg-gray-100 duration-300 rounded-md"
          onClick={() => closeForm("")}
          alt="Close Form"
        ></img>

        <div className="py-6 align-middle pt-10 md:mb-64 mb-40 w-96 px-8 h-96 bg-white rounded shadow-2xl">
          <label className="relative pl-2  sm:left-28 font-bold text-2xl bottom-2 left-20">
            Sign Up
          </label>
          <form
            action="/"
            method="post"
            id="SignUpForm"
            onSubmit={handleSubmit}
          >
            {/* //* Name */}
            <div className="mb-6 relative">
              <label
                htmlFor="text"
                className={`absolute cursor-text left-2 top-4 text-gray-500 font-semibold text-md transition-transform bg-white px-2 ${
                  isFocusedN || name ? "transform -translate-y-6 scale-75" : ""
                }`}
              >
                First Name
              </label>
              <input
                required
                minLength={3}
                type="text"
                name="name"
                id="name"
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                onFocus={() => setFocusedN(true)}
                onBlur={() => setFocusedN(false)}
              />{" "}
            </div>

            {/* //* Email */}
            <div className="mb-6 relative">
              <label
                htmlFor="email"
                className={`absolute cursor-text left-2 top-4 text-gray-500 font-semibold text-md transition-transform bg-white px-2 ${
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
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                onFocus={() => setFocusedE(true)}
                onBlur={() => setFocusedE(false)}
              />{" "}
            </div>

            {/* //* Password */}
            <div className=" relative pb-4">
              <label
                htmlFor="password"
                className={`absolute cursor-text left-2 top-4 text-gray-500 font-semibold text-md transition-transform bg-white px-2 ${
                  isFocusedP || password
                    ? "transform -translate-y-6 scale-75"
                    : ""
                }`}
              >
                Password
              </label>
              <input
                required
                minLength={6}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder=""
                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                value={password}
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
              {errorMessage && (
                <div className="text-red-500 text-xs absolute pt-0.5 top-12 z-40">
                  {errorMessage}
                </div>
              )}
            </div>
            <button
              type="submit"
              form="SignUpForm"
              className="text-white mb-2 bg-gray-800 w-full px-5 py-2 border border-solid border-gray-900 rounded transition hover:bg-gray-900 hover:text-white active:translate-y-1 active:translate-x-1 duration-300 font-semibold text-sm "
            >
              Sign Up
            </button>
          </form>
          <GoogleAuthButton msg={"Sign Up With Google"} />
        </div>
      </div>
    </>
  );
}

export default SignForm;
