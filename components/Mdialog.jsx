import { makeStyles } from "@material-ui/core/styles";
import { useState, forwardRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  DialogContent,
  LinearProgress,
  Slide,
} from "@material-ui/core";
import JSZip from "jszip";
import toPercent from "decimal-to-percent";
import numeral from "numeral";
import convert from "number-to-words";
import { saveAs } from "file-saver";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles({
  dialog: {
    borderRadius: "0px",
  },
});

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Mdialog = ({ open, setOpen, data }) => {
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const generatePdf = () => {
    if (data.length) {
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
          handleClose();
        }
      });
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

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      classes={{ paper: classes.dialog }}
    >
      {loading ? <LinearProgress /> : ""}
      <DialogTitle>Download Files</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are You Sure You Want to Continue ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant={"contained"} onClick={generatePdf} color="primary">
          Pdfs
        </Button>
        <Button
          variant={"contained"}
          onClick={handleClose}
          color="secondary"
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default Mdialog;
