import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { storeAuth } from "../hooks";
import { toast } from "./toast";

/**
 * makeRequest is a function that makes a request to the server
 * @param url - the URL to make the request to
 * @param options - the options for the request
 * @returns the response from the server
 */

export const BASE_URL = "http://127.0.0.1:3000/api/v1"

const request = axios.create({ baseURL: `${BASE_URL}` });

/**
 * a request interceptor for an HTTP client (likely Axios) to automatically add an authorization token to outgoing requests
 */
request.interceptors.request.use((config) => {
    if (storeAuth.token) {
        config.headers.Authorization = storeAuth.token;
    }
    return config;
});

/**
 * a response interceptor for an HTTP client (likely Axios) to automatically handle errors and extract data from responses
 */
request.interceptors.response.use((response) => {
    const data = response?.data;
    if (data.code === 0 && data.msg !== undefined) {
        toast.success(data.msg);
    }
    return response;
}, (error) => {
    const {code, response} = error;
    if (code === 'ERR_BAD_REQUEST') {
        toast.error(response?.data?.message ?? "Unknown error");
    }
    return Promise.reject(error);
});

/**
 * makeRequest is a function that makes a request to the server
 * @param url - the URL to make the request to
 * @param options - the options for the request
 * @returns the response from the server
 */
export default async function makeRequest(
    url: string,
    options?: AxiosRequestConfig
  ) {
    return (
      await request({ // invoke axios instance that created above - const request = axios.create({ baseURL: `${BASE_URL}` });
        url,
        ...options,
      })
    ).data;
  }
  



