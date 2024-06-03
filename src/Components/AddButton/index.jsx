import "./style.css";
const AddButton = ({ onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        viewBox="0 0 20 20"
        height="50"
        fill="none"
        className="svg-icon alignic"
      >
        <g strokeWidth="1.5" strokeLinecap="round" stroke="white">
          <circle r="7.5" cy="10" cx="10"></circle>
          <path d="m9.99998 7.5v5"></path>
          <path d="m7.5 9.99998h5"></path>
        </g>
      </svg>
    </button>
  );
};
export default AddButton;
