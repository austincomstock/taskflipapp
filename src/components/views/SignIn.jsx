// OTHER IMPORTS
import React from "react";
import { makeStyles, Card } from "@material-ui/core";

// FIREBASE IMPORTS
// import { auth } from "../../App.js";
import firebase from "firebase/compat/app";
import { StyledFirebaseAuth } from "react-firebaseui";

const useStyles = makeStyles(() => ({
  background: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url(https://source.unsplash.com/featured/?abstract)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  },
}));

export const SignIn = () => {
  const classes = useStyles();

  // Configure firebaseui
  const uiConfig = {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
  };

  return (
    <div className={classes.background}>
      <Card>
        <h1>Sign In</h1>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </Card>
    </div>
  );
};
