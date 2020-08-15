import { icons } from "../data/icon.data";

const Micon = ({ icon }) => {
  const iconData = icons[icon];

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
      <path d={iconData.path1} style={{ opacity: 0.4 }} className="primary" />
      {iconData.path2 ? <path d={iconData.path2} className="secondary" /> : ""}
    </svg>
  );
};

export default Micon;
