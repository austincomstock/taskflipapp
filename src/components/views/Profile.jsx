import React, { useEffect } from "react";
import {
  Button,
  Card,
  Container,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { setProfile } from "../../database/firestoreFunctions";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "column",
    padding: "24px",
  },
}));

export const Profile = ({ user }) => {
  const classes = useStyles();
  const history = useHistory();
  const [first, setFirst] = React.useState(user.firstName);
  const [last, setLast] = React.useState(user.lastName);
  const [theme, setTheme] = React.useState(user.theme);

  useEffect(() => {
    setFirst(user.firstName);
    setLast(user.lastName);
    setTheme(user.theme);
  }, [user]);

  const handleSave = () => {
    setProfile({ firstName: first, lastName: last, theme });
  };

  return (
    <Container maxWidth="sm">
      <h1>Profile</h1>
      <br />
      <Card className={classes.card}>
        <TextField
          label="First Name"
          value={first}
          onInput={(e) => setFirst(e.target.value)}
        />
        <br />
        <TextField
          label="Last Name"
          value={last}
          onInput={(e) => setLast(e.target.value)}
        />
        <br />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Theme</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </FormControl>
        <br />
        <Button onClick={handleSave} variant="outlined" color="primary">
          Save
        </Button>
      </Card>
      <br />
      <Button
        fullWidth
        onClick={() => history.push("/signout")}
        variant="outlined"
        color="secondary"
      >
        Sign Out
      </Button>
    </Container>
  );
};
