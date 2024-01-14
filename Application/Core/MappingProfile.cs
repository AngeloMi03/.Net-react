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
            CreateMap<Activity, Activity>();

            CreateMap<Activity, ActivityDtos>()
              .ForMember(d => d.HostUserName, o => o.MapFrom(x => x.Attendees
                    .FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
              .ForMember(d => d.DisplayName, o => o.MapFrom(x => x.AppUser.DisplayName))
              .ForMember(d => d.UserName, o => o.MapFrom(x => x.AppUser.UserName))
              .ForMember(d => d.Bio, o => o.MapFrom(x => x.AppUser.Bio))
              .ForMember(d => d.Image, o => o.MapFrom(x => x.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url));
            
            CreateMap<AppUser, UserProfile>()
              .ForMember(d => d.Image, o => o.MapFrom(x => x.Photos.FirstOrDefault(p => p.IsMain).Url));

              CreateMap<Comment, CommentsDto>()
              .ForMember(d => d.DisplayName, o => o.MapFrom(x => x.Author.DisplayName))
              .ForMember(d => d.UserName, o => o.MapFrom(x => x.Author.UserName))
              .ForMember(d => d.Image, o => o.MapFrom(x => x.Author.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}