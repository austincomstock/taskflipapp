// FIREBASE IMPORTS
import { auth, db } from "../App.js";
import {
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { collection } from "firebase/firestore";

// WATCHPROFILE FUNCTION
export function watchProfile(setData) {
  const uid = auth.currentUser.uid;
  const unsub = onSnapshot(doc(db, "users", uid), (user) => {
    if (user.data()) {
      // User profile exists
      console.log("profile does exist");
      console.log(user.data());
      setData(user.data());
    } else {
      // User profile does NOT exist
      console.log("profile does not exist");
      const displayName = auth.currentUser.displayName;
      setProfile({
        firstName: displayName,
        lastName: "",
        theme: "light",
      });
    }
  });
  return unsub;
}

// SETPROFILE FUNCTION
export function setProfile(data) {
  const uid = auth.currentUser.uid;
  const user = doc(db, "users", uid);

  return setDoc(user, data, { merge: true });
}

// WATCHBOARD FUNCTION
export function watchBoard(setData) {
  const uid = auth.currentUser.uid; // - instructor removes this from his code, i get an error if i remove
  // const board = getBoardRef(); The instructor uses this

  const unsub = onSnapshot(doc(db, "boards", uid), (user) => {
    if (user.data()) {
      // Board exists
      console.log("board exists");
      setData(user.data());
    } else {
      // Board does NOT exisit
      console.log("board does not exist");

      setBoard({
        columnOrder: [],
      });
    }
  });

  return unsub;
}

// SETBOARD FUNCTION
export function setBoard(data) {
  const uid = auth.currentUser.uid;
  const board = doc(db, "boards", uid);

  return setDoc(board, data, { merge: true });
}

// SETCOLUMN FUNCTION
export function setColumn(columnId, data) {
  const uid = auth.currentUser.uid;
  const columnDoc = doc(db, "boards", uid, "columns", columnId);

  return setDoc(columnDoc, data, { merge: true });
}

// PUSHTOCOLUMNORDER FUNCTION
export function pushToColumnOrder(value) {
  const uid = auth.currentUser.uid;
  const board = doc(db, "boards", uid);

  return updateDoc(board, {
    columnOrder: firebase.firestore.FieldValue.arrayUnion(value),
  });
}

// POPFROMCOLUMNORDER FUNCTION
export function popFromColumnOrder(value) {
  const uid = auth.currentUser.uid;
  const board = doc(db, "boards", uid);

  return board.update({
    columnOrder: firebase.firestore.FieldValue.arrayRemove(value),
  });
}

// WATCHCOLUMNS FUNCTION
export function watchColumns(setData) {
  const uid = auth.currentUser.uid;
  const columns = collection(db, "boards", uid, "columns");

  const unsub = onSnapshot(columns, (columns) => {
    const returnData = {};
    columns.forEach((col) => {
      returnData[col.id] = col.data();
    });
    setData(returnData);
  });

  return unsub;
}

// DELETECOLUMN FUNCTION
export function deleteColumn(columnId) {
  const uid = auth.currentUser.uid;
  const columnDoc = doc(db, "boards", uid, "columns", columnId);

  return deleteDoc(columnDoc);
}

// DELETETASKS FUNCTION
export function deleteTasks(taskIds) {
  const uid = auth.currentUser.uid;
  return;
}

// SETTASK FUNCTION
export function setTask(taskId, data) {
  const uid = auth.currentUser.uid;
  const taskDoc = doc(db, "boards", uid, "tasks", taskId);

  return setDoc(taskDoc, data, { merge: true });
}

// PUSHTASKID FUNCTION
export function pushTaskId(columnId, taskId) {
  const uid = auth.currentUser.uid;
  const column = doc(db, "boards", uid, "columns", columnId);
  return updateDoc(column, {
    taskIds: firebase.firestore.FieldValue.arrayUnion(taskId),
  });
}

// POPTASKID FUNCTION
export function popTaskId(columnId, taskId) {
  const uid = auth.currentUser.uid;
  const column = doc(db, "boards", uid, "columns", columnId);

  return updateDoc(column, {
    taskIds: firebase.firestore.FieldValue.arrayRemove(taskId),
  });
}

// WATCHTASKS FUNCTION
export function watchTasks(setData) {
  const uid = auth.currentUser.uid;
  const tasks = collection(db, "boards", uid, "tasks");

  const unsub = onSnapshot(tasks, (tasks) => {
    const returnData = {};
    tasks.forEach((task) => (returnData[task.id] = task.data()));
    setData(returnData);
  });

  return unsub;
}
