import http from "./httpService";
import { SERVERURI } from "../../constants";

const apiEndpoint = `${SERVERURI}auth/`;
const newAccessTokenEndpoint = "refresh_token";

async function getNewAccessToken(refreshToken) {
  const request = apiEndpoint + newAccessTokenEndpoint + "?refresh_token=" + refreshToken;
  return await http.get(request);
}

export default {
  getNewAccessToken
};
