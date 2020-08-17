import { useState } from "react";
import { tableData } from "../data/table.data";
import { colData } from "../data/col.data";
import MtableRow from "./MtableRow";
import { v4 as uuid } from "uuid";
import Mtoolbar from "./Mtoolbar";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  makeStyles,
} from "@material-ui/core";
import MAlert from "./MAlert";

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    padding: 30,
  },

  tableContainer: {
    maxWidth: "1550px",
    maxHeight: "400px",
  },
  table: {
    width: "1550px",
  },
  tableHead: {
    fontWeight: "bold",
  },
});

const dataWithId = tableData.map((item, index) => {
  return {
    id: index + 1,
    ...item,
  };
});

const Mtable = () => {
  const [data, setData] = useState(dataWithId);
  const classes = useStyles();
  const [alert, setAlert] = useState({
    visible: false,
  });

  return (
    <div className={classes.container}>
      {alert.visible ? (
        <MAlert severity={alert.severity}>{alert.value}</MAlert>
      ) : (
        ""
      )}
      <Mtoolbar setData={setData} data={data} setAlert={setAlert} />
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} size="small">
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell key={uuid()} align="left">
                id
              </TableCell>
              {colData.map((item) => {
                return (
                  <TableCell key={uuid()} align="left">
                    {item}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          {
            <TableBody>
              {data.map((item) => {
                return (
                  <MtableRow
                    rowData={item}
                    key={item.id}
                    setData={setData}
                    data={data}
                  />
                );
              })}
            </TableBody>
          }
        </Table>
      </TableContainer>
    </div>
  );
};
export default Mtable;
