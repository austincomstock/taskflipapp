import { Button, Card, makeStyles } from "@material-ui/core";
import React from "react";
import AddBoxRoundedIcon from "@material-ui/icons/AddBoxRounded";
import {
  pushToColumnOrder,
  setColumn,
} from "../../database/firestoreFunctions";

const useStyles = makeStyles((theme) => ({
  column: {
    margin: "8px",
    minWidth: "200px",
    border: `1px dashed ${theme.palette.grey.A100}`,
  },
  button: {
    height: "100%",
    width: "100%",
    color: theme.palette.text.secondary,
  },
}));

export const AddColumn = ({ data, setData }) => {
  const classes = useStyles();

  const addColumn = () => {
    // Get column id numbers as an array
    // ["column-1", "column-2"] => [1,2]
    const columnIds = Object.keys(data.columns).map((id) =>
      Number(id.split("-")[1])
    );
    const nextIndex = columnIds.length ? Math.max(...columnIds) + 1 : 1;
    const nextKey = `column-${nextIndex}`;

    setColumn(nextKey, {
      id: nextKey,
      title: "New Column",
      taskIds: [],
    }).then(() => {
      pushToColumnOrder(nextKey);
    });
  };

  return (
    <Card className={classes.column} variant="outlined">
      <Button className={classes.button} onClick={addColumn}>
        <AddBoxRoundedIcon fontSize="large" />
      </Button>
    </Card>
  );
};
