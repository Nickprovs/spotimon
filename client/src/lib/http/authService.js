import http from "./httpService";

const apiEndpoint = "http://localhost:8888/api/auth";
const newAccessTokenEndpoint = "/refresh_token";

async function getNewAccessToken(refreshToken) {
  const request = apiEndpoint + newAccessTokenEndpoint + "?refresh_token=" + refreshToken;
  return await http.get(request);
}

export default {
  getNewAccessToken
};
