const MtableCell = ({ children, colName, onCellUpdate, isId }) => {
  const handleChange = (e) => {
    let value = e.target.value;
    onCellUpdate(value, colName);
  };

  if (isId) {
    return <td>{children}</td>;
  } else {
    return (
      <td>
        <input value={children} onChange={handleChange} />
      </td>
    );
  }
};
export default MtableCell;
