import { useState } from "react";
import XLSX from "xlsx";
import moment from "moment";
import JSZip from "jszip";
import toPercent from "decimal-to-percent";
import numeral from "numeral";
import convert from "number-to-words";
import { saveAs } from "file-saver";

const Mtoolbar = ({ setData, data }) => {
  const [loading, setLoading] = useState(false);

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

  console.log(newData);

  const generatePdf = () => {
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
    <div className="toolbar">
      <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
      <button onClick={generatePdf}>Download Pdf</button>
      {loading ? "Loading..." : ""}
    </div>
  );
};
export default Mtoolbar;
