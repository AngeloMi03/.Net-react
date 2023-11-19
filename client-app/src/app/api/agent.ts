import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/Activity";
import { resolve } from "path";
import { error } from "console";

const sleep = (delay : number) =>{
    return new Promise((resolve) =>{
        setTimeout(resolve, delay); 
    }) 
}

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use(async (response) =>{
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

const responseBody = <T> (response : AxiosResponse<T>) => (response.data);

const request = {
    get : <T> (url :  string) => axios.get<T>(url).then(responseBody),
    post : <T> (url :  string, body : {}) => axios.post<T>(url, body).then(responseBody),
    put : <T> (url :  string , body : {}) => axios.put<T>(url, body).then(responseBody),
    del : <T> (url :  string) => axios.delete(url).then<T>(responseBody),
}

const activities = {
    list : () => request.get<Activity[]>("/activities"),
    details : (id : string) => request.get<Activity>(`/activities/${id}`),
    create : (activity : Activity) => request.post<void>('/activities', activity),
    update : (activity : Activity) => request.put<void>(`/activities/${activity.id}`,activity),
    delete : (id : string) => request.del<void>(`/activities/${id}`)
}

const agent = {
    activities
}

export default agent;