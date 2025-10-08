/* eslint-disable @typescript-eslint/no-explicit-any */
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
      // Log the full request details
      console.log(`Making API request:`, {
        url: url,
        method: method || 'GET',
        baseURL: axiosInstance.defaults.baseURL,
        withCredentials: axiosInstance.defaults.withCredentials,
        data: data || null,
        params: params || null,
        headers: headers || {}
      });
      
      // Track timing for debugging purposes
      const startTime = Date.now();
      
      const result = await axiosInstance({
        url: url,
        method,
        data,
        params,
        headers,
      });
      
      // Calculate response time
      const responseTime = Date.now() - startTime;
      
      console.log(`API response from ${url}:`, {
        status: result.status, 
        statusText: result.statusText,
        responseTime: `${responseTime}ms`,
        dataPreview: result.data ? (typeof result.data === 'object' ? '✓ Object received' : '✓ Data received') : '⚠️ No data'
      });
      
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
        
        // Special handling for common error codes
        if (errorStatus === 409) {
          // Check for specific conflict errors
          const data = err.response?.data as Record<string, any>;
          const message = typeof data === 'object' ? data.message : undefined;
          const error = typeof data === 'object' ? data.error : undefined;
          
          if (message && typeof message === 'string' && message.includes('email')) {
            errorMessage = "An account with this email already exists. Please use a different email address.";
          } else if (
            (message && typeof message === 'string' && message.includes('plate')) || 
            (error && typeof error === 'string' && error.includes('plate'))
          ) {
            errorMessage = "This vehicle plate number is already registered. Please use a different plate number.";
          } else if (message && typeof message === 'string' && message.includes('licenseNumber')) {
            errorMessage = "This driver license number is already registered. Please use a different license number.";
          } else {
            errorMessage = "This information already exists in our system. Please try with different details.";
          }
          console.warn("409 Conflict detected:", err.response?.data);
        } else if (errorStatus === 401) {
          errorMessage = "Authentication required. Please log in again.";
        } else if (errorStatus === 403) {
          errorMessage = "You don't have permission to perform this action.";
        } else {
          // General case for other error codes
          const data = err.response?.data as Record<string, any>;
          errorMessage = typeof data === 'object' && data !== null 
            ? (data.message || JSON.stringify(data)) 
            : String(err.response?.data || err.message);
        }
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
