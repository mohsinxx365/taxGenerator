import { colData } from "../col.data";
import MtableCell from "./MtableCell";

const MtableRow = ({ rowData, setData, data }) => {
  const onCellUpdate = (newVal, colName) => {
    const updatedRow = { ...rowData, [colName]: newVal };
    const updatedData = data.map((item) => {
      return item.id === updatedRow.id ? updatedRow : item;
    });
    setData(updatedData);
  };

  return (
    <tr>
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
    </tr>
  );
};
export default MtableRow;
