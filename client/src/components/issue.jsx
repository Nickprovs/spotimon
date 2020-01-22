import React from "react";

const Issue = ({ history }) => {
  let issue = "Issue";
  if (history.location.state && history.location.state.issue) issue = history.location.state.issue;

  return (
    <div className="center-wrapper">
      <h1 className="standard-text">{issue}</h1>
    </div>
  );
};

export default Issue;
