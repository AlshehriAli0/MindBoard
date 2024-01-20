import React, { useState, useEffect } from "react";
import axios from "axios";
import Account from "./Account";

function UserBtn({ fetchData }) {
  // * hooks
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  // * toggle menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  // * toggle account
  const toggleAccount = () => {
    setShowAccount((prev) => !prev);
  };


  // * logout
  const handleLogout = async () => {
    try {
      await axios.get("/api/logout", { withCredentials: true });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // * fetch user data
  const fetchUserData = async () => {
    try {
      const res = await axios.get("/api/user", {
        withCredentials: true,
      });
      setUser(res.data.name);
      setEmail(res.data.email);
      setDate(res.data.date);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  //
  const handleUpdateUser = async () => {
    fetchUserData();
  };

  return (
    <>
      <div className="relative mr-2 md:mr-0 ">
        <button
          onClick={toggleMenu}
          className={`text-white animate-fade-left animate-duration-[1500ms] animate-delay-[550ms] animate-ease-out bg-gray-800 flex items-center px-5 py-1 border border-solid border-gray-800 rounded transition hover:bg-gray-900 duration-300 font-semibold text-sm ${
            isMenuOpen ? "bg-gray-900" : ""
          }`}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/user.png`}
            className="h-5 mr-2"
            alt="User img"
          />
          <p className="text-lg pt-1">{user}</p>
        </button>
        <div
          className={`absolute top-full  left-0 mt-2 z-40 ${
            isMenuOpen ? "animate-fade-up" : "hidden"
          } animate-duration-[200ms] animate-ease-out animate-normal bg-gray-800 border border-gray-700 rounded-md shadow-md`}
        >
          <button
            onClick={() => {
              toggleAccount();
              toggleMenu();
            }}
            className="block px-5 py-2 text-white rounded transition hover:bg-gray-900 duration-300 focus:outline-none"
          >
            <div className="flex items-center justify-center">
              <img
                src={`${process.env.PUBLIC_URL}/assets/skills.png`}
                alt="Account"
                className="h-5 mr-1"
              />
              <p className="pt-1">Account</p>
            </div>
          </button>
          <hr className="w-9/12 mx-auto" />

          <button
            onClick={handleLogout}
            className="block px-5 py-2 text-white rounded transition hover:bg-gray-900 duration-300 focus:outline-none w-full"
          >
            <div className="flex items-center justify-center">
              <img
                src={`${process.env.PUBLIC_URL}/assets/logout.png`}
                alt=""
                className="h-4 mr-2"
              />
              <p className="">LogOut</p>
            </div>
          </button>
        </div>
      </div>

      {showAccount && (
        <Account
          toggleAccount={toggleAccount}
          fetchData={handleUpdateUser}
          name={user}
          email={email}
          date={date}
        />
      )}
    </>
  );
}

export default UserBtn;
