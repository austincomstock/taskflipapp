import React from "react";
import { auth } from "../../App.js";

export const SignOut = () => {
  auth.signOut();

  return (
    <div>
      <h1>Sign Out</h1>
    </div>
  );
};
