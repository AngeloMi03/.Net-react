import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity, ActivityFormValues } from "../models/Activity";
import { toast } from "react-toastify";
import { router } from "../router/Route";
import { store } from "../stores/store";
import { User, UserFormValues } from "../models/User";
import { Photo, Profile } from "../models/Profile";
import { PaginationResult } from "../models/Pagination";

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
    const pagination = response.headers['pagination']
    if(pagination)
    {
      response.data = new PaginationResult(response.data, JSON.parse(pagination))
      return response as AxiosResponse<PaginationResult<any>>
    }

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
  list: (params : URLSearchParams) => axios.get<PaginationResult<Activity[]>>("/activities", {params})
    .then(responseBody),
  details: (id: string) => request.get<Activity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) => request.post<void>("/activities", activity),
  update: (activity: ActivityFormValues) =>
    request.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => request.del<void>(`/activities/${id}`),
  attend : (id : string) => request.post<void>(`activities/${id}/attend`, {})
};

const profile = {
  get : (userName : string) => request.get<Profile>(`/profiles/${userName}`),
  uploadPhoto : (file : Blob) => {
    let formData =  new FormData();
    formData.append('File', file);
    return axios.post<Photo>('photos', formData, {
      headers : {'Content-Type' : 'multipart/form-data'}
    })
  },
  setMainPhoto : (id : string) => request.post(`/photos/${id}/setMain`, {}),
  deletePhoto : (id : string) => request.del(`photos/${id}`),
  updateFollowing : (username : string) => request.post(`/follow/${username}`, {}),
  listFollowings : (username : string, predicate : string) => 
    request.get<Profile[]>(`/follow/${username}?predicate=${predicate}`)
}

const account = {
  current: () => request.get<User>("/account"),
  login: (user: UserFormValues) => request.post<User>("/account/login", user),
  register: (user: UserFormValues) =>
    request.post<User>("/account/register", user),
};



const agent = {
  activities,
  account,
  profile,
};

export default agent;
