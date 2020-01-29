if (!process.env.REACT_APP_SERVER_PORT)
  throw new Error("REACT_APP_SERVER_PORT environment variable is not set. Should be set through a config file.");

if (!process.env.REACT_APP_SERVER_ADDRESS)
  throw new Error("REACT_APP_SERVER_Address environment variable is not set. Should be set through a config file.");

if (!process.env.REACT_APP_SERVER_API_PATH)
  throw new Error("REACT_APP_SERVER_API_PATH environment variable is not set. Should be set through a config file.");

export const SERVERURI =
  process.env.REACT_APP_SERVER_PORT == "80"
    ? `${process.env.REACT_APP_SERVER_ADDRESS}${process.env.REACT_APP_SERVER_API_PATH}`
    : `${process.env.REACT_APP_SERVER_ADDRESS}:${process.env.REACT_APP_SERVER_PORT}${process.env.REACT_APP_SERVER_API_PATH}`;

export const LOGINURI = `${SERVERURI}auth/login`;
