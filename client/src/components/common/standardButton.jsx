import React from "react";
import "../../styles/standardButton.css";

const StandardButton = ({ children, className, onClick, ...rest }) => {
  return (
    <button onClick={onClick} className={"standardButton " + className} {...rest}>
      {children}
    </button>
  );
};

export default StandardButton;
