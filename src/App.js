// OTHER IMPORTS
import "./App.css";
import { Component } from "react";
import { Columns } from "./components/board/Columns";
// import initialData from "./initialData";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { SignIn } from "./components/views/SignIn";
import { SignOut } from "./components/views/SignOut";
import { Profile } from "./components/views/Profile";
import Navbar from "./components/views/Navbar";
import { React } from "react";

// FIRESTORE DB IMPORTS
// import * as db from "./database/firestoreFunctions"; - This is what the instrcutor uses. This throws an error. "Identifer db has already been declared"
import * as firestoreFunctions from "./database/firestoreFunctions"; // I name it firestoreFunctions to avoid the error mentioned above.

// FIREBASE IMPORTS
// import firebase from 'firebase' - This is what the instrcutor uses. This throws an error.
// import "firebase/firestore"; - This is what the instrcutor uses. This throws an error.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import firebaseConfig from "./config/firebase-config.json";

import { getAuth, onAuthStateChanged } from "firebase/auth"; // Add this from the refactor v9 documenation https://firebase.google.com/docs/web/modular-upgrade#update_imports_to_v9_compat
import { getFirestore } from "firebase/firestore"; // Add this from the refactor v9 documenation https://firebase.google.com/docs/web/modular-upgrade#update_imports_to_v9_compat
import { createTheme, ThemeProvider, Paper } from "@material-ui/core";

// INIT FIREBASE
const firebaseApp = firebase.initializeApp(firebaseConfig);

// const db = firebaseApp.firestore();
// const auth = firebase.auth;
const db = getFirestore(firebaseApp); // Add this from the refactor v9 documenation https://firebase.google.com/docs/web/modular-upgrade#update_imports_to_v9_compat
const auth = getAuth(firebaseApp); // Add this from the refactor v9 documenation https://firebase.google.com/docs/web/modular-upgrade#update_imports_to_v9_compat

export { auth, db };

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        tasks: {},
        columns: {},
        columnOrder: [],
      },
      user: {
        firstName: "",
        lastName: "",
        theme: "light",
      },
    };
  }

  componentDidMount() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in!");

        // db.watchProfile(); //- This is what the instrcutor uses
        firestoreFunctions.watchProfile((data) =>
          this.setState({ user: data })
        );

        firestoreFunctions.watchBoard((data) => {
          this.setState({ data: { ...this.state.data, ...data } });
        });

        firestoreFunctions.watchColumns((columns) => {
          this.setState({
            data: {
              ...this.state.data,
              columns,
            },
          });
        });

        firestoreFunctions.watchTasks((tasks) => {
          this.setState({
            data: {
              ...this.state.data,
              tasks,
            },
          });
        });

        if (window.location.pathname === "/signin") {
          window.location.href = "/";
        }
      } else {
        console.log("User is NOT signed in!");
        if (window.location.pathname !== "/signin") {
          window.location.href = "/signin";
        }
      }
    });
  }

  render() {
    const theme = createTheme({ palette: { type: this.state.user.theme } });

    return (
      <ThemeProvider theme={theme}>
        <Paper className="App">
          <Router>
            <Switch>
              <Route path="/signin">
                <SignIn />
              </Route>
              <Route path="/signout">
                <SignOut />
              </Route>
              <Route path="/profile">
                <Navbar />
                <Profile user={this.state.user} />
              </Route>
              <Route path="/">
                <Navbar />
                <h1>Board</h1>
                <Columns
                  data={this.state.data}
                  setData={(data) => this.setState({ data })}
                />
              </Route>
            </Switch>
          </Router>
        </Paper>
      </ThemeProvider>
    );
  }
}

export default App;
