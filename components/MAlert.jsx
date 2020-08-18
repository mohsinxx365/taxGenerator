import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  alert: {
    width: "100%",
    maxWidth: "1550px",
    marginBottom: "10px",
  },
});

const Malert = ({ severity, children }) => {
  const classes = useStyles();

  return (
    <Alert className={classes.alert} severity={severity}>
      {children}
    </Alert>
  );
};
export default Malert;
