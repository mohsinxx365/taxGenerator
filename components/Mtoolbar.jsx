import { useState } from "react";
import XLSX from "xlsx";
import moment from "moment";

import {
  makeStyles,
  Toolbar,
  IconButton,
  LinearProgress,
  Container,
  Typography,
} from "@material-ui/core";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import GetAppIcon from "@material-ui/icons/GetApp";
import Mdialog from "./Mdialog";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: 0,
    padding: 0,
    width: "100%",
    maxWidth: "1550px",
    marginBottom: 10,
  },
  toolBar: {
    width: "100%",
  },
  title: {
    flexGrow: 1,
    fontWeight: 600,
    [theme.breakpoints.down("sm")]: {
      width: "400px",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  },
}));

const Mtoolbar = ({ setData, data, setAlert }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClick = () => {
    if (data.length) {
      setOpen(true);
    } else {
      setAlert({
        value: "Please Enter Some Data !!",
        severity: "warning",
        visible: true,
      });

      setTimeout(() => {
        setAlert({
          visible: false,
        });
      }, 3000);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileData = new Uint8Array(e.target.result);
      const workbook = XLSX.read(fileData, { type: "array", cellDates: true });
      const firstSheet = workbook.SheetNames[0];
      const elements = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
      const mydata = elements.map((item, index) => {
        const originalDate = item["Payment Date"];
        let date = moment(originalDate).add(1, "hours").format("Do MMMM YYYY");
        if (date === "Invalid date") date = originalDate;
        return { id: index + 1, ...item, "Payment Date": date };
      });
      setData(mydata);
    };
    await reader.readAsArrayBuffer(file);
  };

  return (
    <Container className={classes.container}>
      <Mdialog open={open} setOpen={setOpen} data={data} setAlert />
      <Toolbar className={classes.toolBar}>
        <Typography className={classes.title}>
          Tax Certificate Generator
        </Typography>
        <input
          id="icon-button-file"
          type="file"
          style={{ display: "none" }}
          accept=".xls,.xlsx"
          onChange={handleFileChange}
        />
        <label htmlFor="icon-button-file">
          <IconButton title="Upload File" component="span">
            <InsertDriveFileIcon />
          </IconButton>
        </label>

        <IconButton title="Download Pdfs" onClick={handleClick}>
          <GetAppIcon />
        </IconButton>
      </Toolbar>
    </Container>
  );
};
export default Mtoolbar;
