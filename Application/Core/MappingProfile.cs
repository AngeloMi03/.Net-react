using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Comments;
using Application.ProfileUser;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            string currentUsername = null;

            CreateMap<Activity, Activity>();

            CreateMap<Activity, ActivityDtos>()
              .ForMember(d => d.HostUserName, o => o.MapFrom(x => x.Attendees
                    .FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
              .ForMember(d => d.DisplayName, o => o.MapFrom(x => x.AppUser.DisplayName))
              .ForMember(d => d.UserName, o => o.MapFrom(x => x.AppUser.UserName))
              .ForMember(d => d.Bio, o => o.MapFrom(x => x.AppUser.Bio))
              .ForMember(d => d.Image, o => o.MapFrom(x => x.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url))
              .ForMember(d => d.FollowersCount, o => o.MapFrom(x => x.AppUser.Followers.Count))
              .ForMember(d => d.FollowingCount, o => o.MapFrom(x => x.AppUser.Followings.Count))
              .ForMember(d => d.Following, o => o.MapFrom(x => x.AppUser.Followers.Any(u => u.Observer.UserName == currentUsername)));
            
            CreateMap<AppUser, UserProfile>()
              .ForMember(d => d.Image, o => o.MapFrom(x => x.Photos.FirstOrDefault(p => p.IsMain).Url))
              .ForMember(d => d.FollowersCount, o => o.MapFrom(x => x.Followers.Count))
              .ForMember(d => d.FollowingCount, o => o.MapFrom(x => x.Followings.Count))
              .ForMember(d => d.Following, o => o.MapFrom(x => x.Followers.Any(u => u.Observer.UserName == currentUsername)));

            CreateMap<Comment, CommentsDto>()
              .ForMember(d => d.DisplayName, o => o.MapFrom(x => x.Author.DisplayName))
              .ForMember(d => d.UserName, o => o.MapFrom(x => x.Author.UserName))
              .ForMember(d => d.Image, o => o.MapFrom(x => x.Author.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<ActivityAttendee, UserActivityDto>()
              .ForMember(d => d.Id, o => o.MapFrom(x => x.Activity.Id))
              .ForMember(d => d.Date, o => o.MapFrom(x => x.Activity.Date))
              .ForMember(d => d.Title, o => o.MapFrom(x => x.Activity.Title))
              .ForMember(d => d.Category, o => o.MapFrom(x => x.Activity.Category))
              .ForMember(d => d.HostUserName, o => o.MapFrom(x => x.Activity.Attendees
                .FirstOrDefault(x => x.IsHost).AppUser.UserName));

            
        }
    }
}