// OTHER IMPORTS
import React from "react";

//FIREBASE IMPORTS
// import firebase from "firebase"; - This throws an error, must use import auth import
import { auth } from "../../App.js";

export const SignOut = () => {
  auth.signOut();

  return (
    <div>
      <h1>Sign Out</h1>
    </div>
  );
};
