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
  
  // Add auth token from localStorage if available
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Using token from localStorage for authorization");
  } else {
    console.log("No token found in localStorage, will rely on cookies if available");
  }

  return config;
}, function (error) {
  // Do something with request error
  console.error("Request interceptor error:", error);
  return Promise.reject(error);
});
// ✅ step-3 for save accessToken for new token
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
    return response;
  }, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    
    // Safely log the error with proper checks to prevent undefined errors
    if (error.response) {
      console.error("API Error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
      
      // Check for different error types
      if (error.response.status === 401 || 
          error.response.status === 403 || 
          (error.response.data && error.response.data.message === "Unauthorized") ||
          (error.response.data && error.response.data.message === "jwt expired")) {
        console.log("Authentication error detected, consider redirecting to login");
        
        // Optional: Redirect to login page for authentication errors
        // window.location.href = '/login';
      } 
      else if (error.response.status === 409) {
        console.warn("Conflict error - resource already exists:", error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API Error: No response received", {
        request: error.request,
        url: error.config?.url
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Error: Request setup failed", {
        message: error.message,
        url: error.config?.url
      });
    }
    
    return Promise.reject(error);
});
  






// ! Full implement for refresh token
// //✅ step-1, new toke Generate
// axiosInstance.interceptors.response.use(
//   (response) => { 
//     console.log("response successfully")
//     return response
//   },
//   async (error) => {
//     // console.log("request Fail", error.response);

//     //✅ step-2
//     const originalRequest = error.config as AxiosRequestConfig &
//     { _retry: boolean; };  // step - 8
//     // console.log("Axios request config:",originalRequest)

//     if (
//       error.response.status === 500 &&
//       error.response.data.message === "jwt expired" && 
//       !originalRequest._retry // step - 8
//     )
//     {
//       console.log("Your toke is expired")

//       originalRequest._retry = true;   // step - 8
      
//       // ✅ step-4
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           pendingQuene.push({resolve, reject})
//         }).then(() => axiosInstance(originalRequest))
//           .catch((error) => Promise.reject(error))
//       }
//       isRefreshing = true;  

//       try {
//         const res = await axiosInstance.post("/auth/refresh-token")
//         console.log("new token arrived:", res);

//         processQueue(null); // step - 6

//         return axiosInstance(originalRequest)  // step - 2 then we see ok,but
//       } catch (error) {
//         //✅ step - 7
//         // console.error(error)
//         processQueue(error);
        
//         return Promise.reject(error);
//       } finally {
//         isRefreshing = false;
//       }
//     }


//     // For Everything
//     return Promise.reject(error);
//   }
// )






