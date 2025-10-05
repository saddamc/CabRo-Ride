import { axiosInstance } from "@/lib/axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      console.log(`Making API request to: ${url}`);
      const result = await axiosInstance({
        url: url,
        method,
        data,
        params,
        headers,
      });
      console.log(`API response from ${url}:`, result.status);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      
      // Better error handling with type safety
      let errorMessage = "Unknown error occurred";
      let errorStatus = 500;
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorStatus = err.response.status;
        errorMessage = typeof err.response.data === 'object' && err.response.data !== null 
          ? JSON.stringify(err.response.data)
          : String(err.response.data || err.message);
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = "No response received from server";
      } else {
        // Something happened in setting up the request
        errorMessage = err.message;
      }
      
      console.error(`API error in request to ${url}:`, {
        status: errorStatus,
        message: errorMessage
      });
      
      return {
        error: {
          status: errorStatus,
          data: err.response?.data || errorMessage,
        },
      };
    }
  };

export default axiosBaseQuery;
