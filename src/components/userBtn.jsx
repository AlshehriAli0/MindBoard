import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

function UserBtn() {
  const [user, setUser] = useState('');

  const getUserName = async () => {
    try {
      await axios
        .get("http://localhost:8080/api/user", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          setUser(res.data);
        });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserName();
  }, []);

  return (
    <>
      <Menu
        animate={{
          mount: { y: 0 },
          unmount: { y: 25 },
        }}
      >
        <MenuHandler>
          <Button className="bg-gray-900"> Menu</Button>
        </MenuHandler>
        <MenuList>
          <MenuItem>
            Welcome <span className="text-black font-semibold">{user}</span>{" "}
          </MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
          <MenuItem>Menu Item 3</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}

export default UserBtn;
