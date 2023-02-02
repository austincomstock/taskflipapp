import { Button, Card, makeStyles } from "@material-ui/core";
import React from "react";
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import { pushTaskId, setTask } from "../../database/firestoreFunctions";

const useStyles = makeStyles((theme) => ({
  task: {
    margin: "4px",
    flexGrow: 1,
    border: `1px dashed ${theme.palette.grey.A100}`,
  },
  button: {
    height: "100%",
    width: "100%",
    color: theme.palette.text.secondary,
    fontSize: "0.7rem",
  },
}));

export const AddTask = ({ data, setData, columnId }) => {
  const classes = useStyles();

  const addTask = () => {
    // Get task id numbers as an array
    const taskIds = Object.keys(data.tasks).map((id) =>
      Number(id.split("-")[1])
    );
    // Get next index available
    const nextIndex = taskIds.length ? Math.max(...taskIds) + 1 : 1;

    // Get task id
    const taskId = `task-${nextIndex}`;

    setTask(taskId, {
      id: taskId,
      content: "Click to edit",
    }).then(() => {
      pushTaskId(columnId, taskId);
    });
  };

  return (
    <Card className={classes.task} variant="outlined">
      <Button
        className={classes.button}
        onClick={addTask}
        startIcon={<AddBoxRoundedIcon fontSize="small" />}
      >
        Add Task
      </Button>
    </Card>
  );
};

export default AddTask;
