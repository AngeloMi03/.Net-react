import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/User";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Route";

export default class UserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get IsloggedIn() {
    return !!this.user;
  }

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.account.login(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => this.user = user);
      router.navigate("/activities")
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };


  register = async (creds: UserFormValues) => {
    try {
      const user = await agent.account.register(creds);
      store.commonStore.setToken(user.token);
      runInAction(() => this.user = user);
      router.navigate("/activities")
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    this.user = null;
    router.navigate('/');
  }

  getUser = async () => {
    try {
       const user = await agent.account.current()
       runInAction(() => this.user = user);
    } catch (error) {
      console.log(error)
    }
  }

  setMain = (image : string) => {
    if(this.user) this.user.image = image;
  }
}


