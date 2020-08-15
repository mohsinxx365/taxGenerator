import { useState } from "react";
import XLSX from "xlsx";
import moment from "moment";
import JSZip from "jszip";
import toPercent from "decimal-to-percent";
import numeral from "numeral";
import convert from "number-to-words";
import { saveAs } from "file-saver";
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

const Mtoolbar = ({ setData, data }) => {
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    setLoading(true);
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
    setLoading(false);
  };

  const generatePdf = () => {
    const newData = data.map((item) => {
      let grossAmt = item["Gross Payment Amt."];
      let taxWithHeld = numeral(
        parseFloat(grossAmt) * parseFloat(item["WithHolding Tax Rate"])
      ).format("0[.]00");
      let currency = item["Currency"].toUpperCase();

      let taxInWords = taxWithHeld.toString().split(".");
      let words = convert.toWords(taxInWords[0]);

      if (taxInWords[1]) {
        taxInWords = `${words} and ${taxInWords[1]}/100`;
      } else {
        taxInWords = words;
      }

      taxInWords = taxInWords.charAt(0).toUpperCase() + taxInWords.slice(1);

      console.log(taxInWords);

      const formatCur = (curr, amount) => {
        return new Intl.NumberFormat(curr).format(amount);
      };

      taxWithHeld = formatCur(item["currency"], taxWithHeld);
      grossAmt = formatCur(item["currency"], grossAmt);

      let displayCurrency =
        currency === "EUR"
          ? "EURO"
          : currency === "QAR"
          ? "Qatari riyals"
          : currency;

      const contractRef = item["Contract Ref"].toString().includes("-")
        ? ""
        : item["Contract Ref"];

      return {
        id: item["id"],
        grossAmt: grossAmt,
        name: item["Name of Beneficiary"],
        contractRef: contractRef,
        currency: currency,
        displayCurrency: displayCurrency,
        paymentDate: item["Payment Date"],
        serviceType: item["Service Type"],
        taxWithHeld: taxWithHeld,
        taxInWords: taxInWords,
        taxRate: toPercent(item["WithHolding Tax Rate"]),
      };
    });

    setLoading(true);
    let zip = new JSZip();
    let count = 0;

    newData.forEach(async (item) => {
      let res = await fetch("/api/generate", {
        body: JSON.stringify(item),
        method: "POST",
      });
      res = await res.arrayBuffer();
      const blob = new Blob([res], { type: "application/pdf" });

      let paymentDate = item.paymentDate;

      if (paymentDate.length > 20) {
        paymentDate = ` - `;
      } else {
        paymentDate = ` - ${item.paymentDate} - `;
      }

      let fileName = `Tax Certificate For ${item.name}${paymentDate}${item.currency}.${item.grossAmt}.pdf`;
      console.log(fileName);
      zip.file(fileName, blob);
      count++;
      if (count == newData.length) {
        zip.generateAsync({ type: "blob" }).then(function (content) {
          saveAs(content, "tax_certs.zip");
        });
        setLoading(false);
      }
    });
  };

  return (
    <Container className={classes.container}>
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

        <IconButton title="Download Pdfs" onClick={generatePdf}>
          <GetAppIcon />
        </IconButton>
      </Toolbar>
      {loading ? <LinearProgress color="primary" /> : ""}
    </Container>
  );
};
export default Mtoolbar;
