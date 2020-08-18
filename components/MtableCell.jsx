import { TableCell } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  input: {
    border: "none",
    outline: "none",
    padding: "7px 5px",
    textOverflow: "ellipsis",

    "&:focus": {
      border: "2px solid #2162D6",
      borderRadius: "5px",
    },
  },
  tableCell: {
    padding: "8px 8px",
  },
});

const MtableCell = ({ children, colName, onCellUpdate, isId }) => {
  const classes = useStyles();
  const handleChange = (e) => {
    let value = e.target.value;
    onCellUpdate(value, colName);
  };

  if (isId) {
    return (
      <TableCell align="center" className={classes.tableCell}>
        {children}
      </TableCell>
    );
  } else {
    return (
      <TableCell align="center" className={classes.tableCell}>
        <input
          value={children}
          onChange={handleChange}
          className={classes.input}
          spellcheck="false"
        />
      </TableCell>
    );
  }
};
export default MtableCell;
