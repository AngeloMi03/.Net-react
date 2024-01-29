import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile, UserActivity } from "../models/Profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
  profile: Profile | null = null;
  loadingProfile = false;
  uploading = false;
  loading = false;
  loadingFollowing = false;
  followings : Profile[] = [];
  activeTab= 0;
  userActivities : UserActivity[] = [];
  loadActivities = false;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.activeTab,
      activetab => {
        if(activetab === 3 || activetab === 4){
          const predicate = activetab === 3 ? "followers" : "following";
          this.loadFollowing(predicate);
        }else{
          this.followings = []
        }
      }
    )
  }

  SetActiveTab = (activeTab : any) => {
       this.activeTab = activeTab;
  }

  get IsCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.userName == this.profile.userName;
    }
    return false;
  }

  loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const Profile = await agent.profile.get(username);
      //console.log("load profile" + JSON.stringify(Profile));
      runInAction(() => {
        this.profile = Profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => (this.loadingProfile = false));
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.uploading = true;
    try {
      const response = await agent.profile.uploadPhoto(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setMain(photo.url);
            this.profile.image = photo.url;
          }
        }
        this.uploading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => (this.uploading = false));
    }
  };

  setMainPhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.profile.setMainPhoto(photo.id);
      store.userStore.setMain(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find((p) => p.isMain)!.isMain = false;
          this.profile.photos.find((p) => p.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
          this.loading = false;
        }
      });
    } catch (error) {
      console.log(error);
      runInAction(() => (this.loading = false));
    }
  };

  deletePhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.profile.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos?.filter(
            (p) => p.id !== photo.id
          );
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => (this.loading = false));
      console.log(error);
    }
  };

  updateFollowing = async (username: string, following: boolean) => {
    this.loading = true;
    console.log("profile" + this.profile?.userName)
    console.log("param" + username)
    try {
      await agent.profile.updateFollowing(username);
      store.activityStore.updateActivityFollowing(username);
      runInAction(() => {
        if (this.profile && this.profile.userName !== store.userStore.user?.userName &&
          this.profile.userName === username  ) { 
          following
            ? this.profile.followersCount++
            : this.profile.followersCount--;
            this.profile.following = !this.profile.following;
            console.log("profile following" + this.profile.following)
        }

        if (
          this.profile &&
          this.profile.userName === store.userStore.user?.userName 
        ) { 
          following
            ? this.profile.followingCount++
            : this.profile.followingCount--;

        }

        this.followings.forEach(profile => {
          if(profile.userName === username)
          {
            profile.following
            ? profile.followersCount++
            : profile.followersCount--;
            profile.following = !profile.following
            console.log("profile list following" + profile.following)
          }
        })

        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => (this.loading = false));
    }
  };


  loadFollowing  =  async(predicate : string) => {
      this.loadingFollowing = true;
      try {
        const followings = await agent.profile.listFollowings(this.profile!.userName, predicate)
        runInAction(() => {
          this.followings = followings;
          this.loadingFollowing = false;
        })
      } catch (error) {
        console.log(error)
        runInAction(() => this.loadingFollowing = false);
      }
  }

  loadUseActivities = async(username : string , predicate? : string) => {
    this.loadActivities = true;
    try {
      var activities = await agent.profile.listActivities(username, predicate!)
      runInAction(() => {
        this.userActivities = activities;
        this.loadActivities = false;
      })
    } catch (error) {
      console.log(error)
      runInAction(() =>{
        this.loadActivities = false;
      })
    }
  }
}
 