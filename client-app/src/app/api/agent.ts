import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../models/Activity";
import { resolve } from "path";
import { error } from "console";
import { toast } from "react-toastify";
import { router } from "../router/Route";
import { store } from "../stores/store";
import { User, UserFormValues } from "../models/User";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if(token && config.headers) config.headers.Authorization = `Bearer ${token}`
    return config;
})

axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    const { status, data, config } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (config.method === "get" && data.error.hasOwnProperty("id")) {
          router.navigate("/not-found");
        }

        if (data.error) {
          const modalStateError = [];
          for (const key in data.error) {
            if (data.error[key]) {
              modalStateError.push(data.error[key]);
            }
          }
          throw modalStateError.flat();
        } else {
          toast.error(data);
        }
        break;
      case 401:
        toast.error("unauthorized");
        break;
      case 403:
        toast.error("forbidden");
        break;
      case 404:
        router.navigate("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(data);
        router.navigate("/server-error");
        break;

      default:
        break;
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  del: <T>(url: string) => axios.delete(url).then<T>(responseBody),
};

const activities = {
  list: () => request.get<Activity[]>("/activities"),
  details: (id: string) => request.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => request.post<void>("/activities", activity),
  update: (activity: Activity) =>
    request.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => request.del<void>(`/activities/${id}`),
};

const account = {
  current: () => request.get<User>("/account"),
  login: (user: UserFormValues) => request.post<User>("/account/login", user),
  register: (user: UserFormValues) =>
    request.post<User>("/account/register", user),
};

const agent = {
  activities,
  account,
};

export default agent;
