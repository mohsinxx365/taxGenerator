import { useState } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles, Paper } from "@material-ui/core";

const useStyles = makeStyles({
  alert: {
    width: "100%",
    maxWidth: "1550px",
    marginBottom: "10px",
  },
});

const MAlert = ({ severity, children }) => {
  const classes = useStyles();
  const [state, setState] = useState({ severity: "error", value: "Hello" });

  return (
    <Alert className={classes.alert} severity={severity}>
      {children}
    </Alert>
  );
};
export default MAlert;
