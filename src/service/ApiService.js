import { API_BASE_URL } from "../api-config";
const ACCESS_TOKEN = "ACCESS_TOKEN";

export function call(api, method, request) {
  let headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
    "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers 
  })

  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken && accessToken !== null) {
    headers.append("Authorization", "Bearer " + accessToken);
  }

  let options = {
    headers: headers,
    url: API_BASE_URL + api,
    method: method,
  };

  if (request) {
    options.body = JSON.stringify(request);
  }

  return fetch(options.url, options)
    .then((response) => response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  ).catch((error) => {
    // 403을 받을 경우 로그인 페이지로 자동으로 리다이렉트 한다.
    if (error) {
      window.location.href = "/login";
    }
    return Promise.reject();
  });
}

export function signin(userDTO) {
  return call("/auth/signin", "POST", userDTO)
  .then((response) => {
    if (response.token) {
      localStorage.setItem(ACCESS_TOKEN, response.token);
      window.location.href = "/";
    }
  })
  .catch(e => {console.error(e)})
}

export function signout() {
  localStorage.setItem(ACCESS_TOKEN, null);
  window.location.href = "/login";
}

export function signup(userDTO) {
  return call("/auth/signup", "POST", userDTO)
  .then((response) => {
    console.log(response);
    window.location.href = "/login";
  })
}