using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.ProfileUser;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<UserProfile>>>
        {
          public string Predicate { get; set; }
          public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserProfile>>>
        {

            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper,IUserAccessor userAccessor)
            {
               _userAccessor = userAccessor;
               _context = context;
               _mapper = mapper;
            }
            public async Task<Result<List<UserProfile>>> Handle(Query request, CancellationToken cancellationToken)
            {
               
               var profiles = new List<UserProfile>();

               switch(request.Predicate)
               {
                   case  "followers" :
                     profiles =  await _context.UsersFollowings
                         .Where(x => x.Target.UserName == request.UserName)
                         .Select(x => x.Observer)
                         .ProjectTo<UserProfile>(_mapper.ConfigurationProvider,
                          new{currentUsername = _userAccessor.GetUsername()})
                         .ToListAsync();
                    break;
                  case  "following" :
                     profiles =  await _context.UsersFollowings
                         .Where(x => x.Observer.UserName == request.UserName)
                         .Select(x => x.Target)
                         .ProjectTo<UserProfile>(_mapper.ConfigurationProvider, 
                           new{currentUsername = _userAccessor.GetUsername()})
                         .ToListAsync();
                    break;
               }

                return Result<List<UserProfile>>.Success(profiles);
            }
        }
    }
}