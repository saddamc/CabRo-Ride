import config from "@/config";
import axios from "axios"; // { type AxiosRequestConfig }


export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true, // for cookie //! reload cookie gone
  // headers: {
  //   Authorization: "saddam hossain er chakri nai"
  // },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) {
  // Do something before request is sent
  // console.log("Axios:",config)  //
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);
// // ✅ step-3 for save accessToken for new token
// let isRefreshing = false;

// let pendingQuene: {
//   resolve: (value: unknown) => void;
//   reject: (value: unknown) => void;
// }[] = [];

// ✅ step - 5
// const processQueue = (error: unknown) => {
//   pendingQuene.forEach((promise) => {
//     if (error) {
//       promise.reject(error)
//     } else {
//       promise.resolve(null);
//     }
//   });

//   pendingQuene = [];
// }

// Add a response interceptor
axiosInstance.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log("Axios:",response)  //
    return response;
  }, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});
  

