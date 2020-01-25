import React from "react";

const Issue = ({ history }) => {
  let issueHeader = "Issue";
  let issueBody = "";

  if (history.location.state && history.location.state.issueHeader) issueHeader = history.location.state.issueHeader;
  if (history.location.state && history.location.state.issueBody) issueBody = history.location.state.issueBody;

  return (
    <div style={{ margin: "10px" }} className="center-wrapper">
      <h1 className="standard-text">{issueHeader}</h1>
      <br />
      <h1 className="standard-text">{issueBody}</h1>
    </div>
  );
};

export default Issue;
