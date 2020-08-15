import { colData } from "../data/col.data";
import MtableCell from "./MtableCell";
import { TableRow } from "@material-ui/core";

const MtableRow = ({ rowData, setData, data }) => {
  const onCellUpdate = (newVal, colName) => {
    const updatedRow = { ...rowData, [colName]: newVal };
    const updatedData = data.map((item) => {
      return item.id === updatedRow.id ? updatedRow : item;
    });
    setData(updatedData);
  };

  return (
    <TableRow>
      <MtableCell isId>{rowData["id"]}</MtableCell>
      {colData.map((item) => {
        return (
          <MtableCell
            key={`${rowData["id"]}-${item}`}
            colName={item}
            onCellUpdate={onCellUpdate}
          >
            {rowData[item]}
          </MtableCell>
        );
      })}
    </TableRow>
  );
};
export default MtableRow;
