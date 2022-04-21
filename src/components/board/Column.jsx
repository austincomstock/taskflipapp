import {
  Card,
  Container,
  Divider,
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { Task } from "./Task";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import { AddTask } from "./AddTask";
import { deleteTasks, setColumn } from "../../database/firestoreFunctions";
import {
  deleteColumn,
  popFromColumnOrder,
} from "./../../database/firestoreFunctions";

const useStyles = makeStyles((theme) => ({
  column: {
    display: "flex",
    flexDirection: "column",
    margin: "8px",
    minWidth: "200px",
  },

  title: {
    margin: "4px",
    minHeight: "30px",
  },
  taskList: {
    padding: 0,
    height: "100%",
  },
  textField: {
    margin: "4px",
  },
}));

export const Column = ({ column, tasks, index, data, setData, isDragging }) => {
  const classes = useStyles();
  const [title, setTitle] = React.useState(column.title);
  const [editTitleMode, setEditTitleMode] = React.useState(false);

  const onTitleClick = () => setEditTitleMode(true);
  const textFieldLostFocus = () => {
    setEditTitleMode(false);

    // Update the data with the new title
    if (title !== column.title) {
      setColumn(column.id, { title });
      //   const newState = { ...data };
      //   newState.columns[column.id].title = title;
      //   setData(newState);
    }
  };

  const onDeleteClicked = () => {
    if (
      window.confirm(
        `Deleting "${column.title}" will also remove all the Tasks inside of it.`
      )
    ) {
      deleteTasks(column.taskIds);
      deleteColumn(column.id);
      popFromColumnOrder(column.id);

      //   // Remove from columnOrder
      //   const columnOrder = Array.from(data.columnOrder);
      //   const index = columnOrder.indexOf(column.id);
      //   columnOrder.splice(index, 1);

      //   // Remove tasks
      //   const tasks = { ...data.tasks };
      //   data.columns[column.id].taskIds.forEach((taskId) => {
      //     delete tasks[taskId];
      //   });

      //   // Remove the column
      //   const columns = { ...data.columns };
      //   delete columns[column.id];

      //   // Create and set the new state
      //   const newData = {
      //     columnOrder,
      //     columns,
      //     tasks,
      //   };
      //   setData(newData);
    }
  };

  const taskComponents = tasks.map((task, index) => {
    // console.log(task);
    // console.log(index);
    if (!task) return null;
    return (
      <Task
        key={task.id}
        task={task}
        index={index}
        data={data}
        setData={setData}
        columnId={column.id}
      />
    );
  });

  if (!isDragging) {
    taskComponents.push(
      <AddTask
        data={data}
        setData={setData}
        key="add-task"
        columnId={column.id}
      />
    );
  }

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <Card
          className={classes.column}
          variant="outlined"
          innerRef={provided.innerRef}
          {...provided.draggableProps}
        >
          {/* COLUMN TITLE */}
          {editTitleMode ? (
            <TextField
              autoFocus
              className={classes.textField}
              onBlur={textFieldLostFocus}
              value={title}
              inputProps={{ style: { textAlign: "center" } }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={onDeleteClicked}>
                    <DeleteRoundedIcon fontSize="small"></DeleteRoundedIcon>
                  </IconButton>
                ),
              }}
              onInput={(e) => setTitle(e.target.value)}
              {...provided.dragHandleProps}
            ></TextField>
          ) : (
            <Typography
              className={classes.title}
              variant="h5"
              {...provided.dragHandleProps}
              onClick={onTitleClick}
              // className={classes.title}
            >
              {column.title}
            </Typography>
          )}

          <Divider />
          {/* TASK LIST */}
          <Droppable droppableId={column.id}>
            {(provider) => (
              <Container
                className={classes.taskList}
                innerRef={provider.innerRef}
                {...provider.droppableProps}
              >
                {taskComponents}
                {provider.placeholder}
              </Container>
            )}
          </Droppable>
        </Card>
      )}
    </Draggable>
  );
};
