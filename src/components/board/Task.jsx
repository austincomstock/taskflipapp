import {
  Button,
  Card,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import {
  deleteTasks,
  popTaskId,
  setTask,
} from "../../database/firestoreFunctions";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    margin: "4px",
    padding: "4px,",
  },
  button: {
    marginTop: "4px",
    flexGrow: 1,
    fontSize: "1rem",
  },
}));

export const Task = ({ task, index, data, setData, columnId }) => {
  const classes = useStyles();
  const [content, setContent] = React.useState(task.content);
  const [editContentMode, setEditContentMode] = React.useState(false);

  const onContentClicked = () => setEditContentMode(true);
  const textFieldLostFocus = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setEditContentMode(false);

      if (content !== task.content) {
        // const newData = { ...data };
        // newData.tasks[task.id].content = content;
        // setData(newData);
        setTask(task.id, { content });
      }
    }
  };

  const deleteTaskClicked = () => {
    if (!window.confirm("Delete task?")) return;

    popTaskId(columnId, task.id);
    deleteTasks([task.id]);
    console.log(columnId);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classes.card}
          variant="outlined"
          onClick={onContentClicked}
          innerRef={provided.innerRef}
          onBlur={textFieldLostFocus}
        >
          {editContentMode ? (
            <React.Fragment>
              <TextField
                autoFocus
                multiline
                inputProps={{ style: { textAlign: "center" } }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
              <Button
                fullWidth
                onClick={deleteTaskClicked}
                variant="outlined"
                color="secondary"
                className={classes.button}
              >
                <DeleteRoundedIcon fontSize="inherit" />
              </Button>
            </React.Fragment>
          ) : (
            <Typography>{task.content}</Typography>
          )}
        </Card>
      )}
    </Draggable>
  );
};
