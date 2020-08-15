import { useState } from "react";
import { tableData } from "../table.data";
import { colData } from "../col.data";
import MtableRow from "./MtableRow";
import { v4 as uuid } from "uuid";
import Mtoolbar from "./Mtoolbar";

const dataWithId = tableData.map((item, index) => {
  return {
    id: index + 1,
    ...item,
  };
});

const Mtable = () => {
  const [data, setData] = useState(dataWithId);

  return (
    <div className="Container">
      <Mtoolbar setData={setData} data={data} />
      <div className="tableContainer">
        <table>
          <thead>
            <tr>
              <th key={uuid()}>id</th>
              {colData.map((item) => {
                return <th key={uuid()}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Mtable;
