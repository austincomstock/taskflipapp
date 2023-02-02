import { Container, makeStyles } from "@material-ui/core";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { setBoard, setColumn } from "../../database/firestoreFunctions";
import { AddColumn } from "./AddColumn";
import { Column } from "./Column";

const useStyles = makeStyles((theme) => ({
  columns: {
    display: "flex",
    overflow: "auto",
  },
}));

export const Columns = ({ data, setData }) => {
  const classes = useStyles();
  const [isDragging, setIsDragging] = React.useState(false);

  // Create columns
  const columns = data.columnOrder.map((columnId, index) => {
    const column = data.columns[columnId];
    if (!column) return null;

    const tasks = column.taskIds.map((taskID) => data.tasks[taskID]);

    return (
      <Column
        key={column.id}
        column={column}
        tasks={tasks}
        index={index}
        data={data}
        setData={setData}
        isDragging={isDragging}
      />
    );
  });

  if (!isDragging) {
    columns.push(<AddColumn key="add-column" data={data} setData={setData} />);
  }

  // Drop handler
  const onDragEnd = (result) => {
    setIsDragging(false);
    const { destination, source, draggableId } = result;

    // Return if there is no destination
    if (!destination) return;

    // Return if the item is dropped where it came from
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log("abort");
      return;
    }

    // HANDLE COLUMN DROP LOGIC

    if (result.type === "column") {
      // Create new column
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      //Create and update new data object
      const newState = {
        ...data,
        columnOrder: newColumnOrder,
      };

      setData(newState);
      setBoard({ columnOrder: newColumnOrder });
      return;
    }

    // HANDLE TASK DROP LOGIC

    // Get start and end columns
    const startColumn = data.columns[source.droppableId];
    const endColumn = data.columns[destination.droppableId];

    // Dropping items in the same column
    if (startColumn === endColumn) {
      // Create a clone of taskIds
      const newTaskIds = Array.from(startColumn.taskIds);
      // Remove source index
      newTaskIds.splice(source.index, 1);
      // Insert the item to the destination index
      newTaskIds.splice(destination.index, 0, draggableId);

      // Create new column
      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };
      setData(newState);
      setColumn(startColumn.id, { taskIds: newTaskIds });
    } else {
      // Source column changes
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        taskIds: startTaskIds,
      };

      // Destination column changes
      const endTaskIds = Array.from(endColumn.taskIds);
      endTaskIds.splice(destination.index, 0, draggableId);
      const newEndColumn = {
        ...endColumn,
        taskIds: endTaskIds,
      };

      // Create new state
      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newStartColumn.id]: newStartColumn,
          [newEndColumn.id]: newEndColumn,
        },
      };
      // Update state
      setData(newState);
      setColumn(newStartColumn.id, { taskIds: startTaskIds });
      setColumn(newEndColumn.id, { taskIds: endTaskIds });
    }
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={() => setIsDragging(true)}
    >
      <Droppable droppableId="all-columns" diretion="horizontal" type="column">
        {(provided) => (
          <Container
            className={classes.columns}
            innerRef={provided.innerRef}
            {...provided.droppableProps}
          >
            {columns}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};
