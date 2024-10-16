using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.ProfileUser
{
    public class Details
    {
        public class Query : IRequest<Result<UserProfile>>
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<UserProfile>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<UserProfile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                   .ProjectTo<UserProfile>(_mapper.ConfigurationProvider, 
                     new { currentUsername = _userAccessor.GetUsername()})
                   .SingleOrDefaultAsync(x => x.UserName == request.UserName);

                return Result<UserProfile>.Success(user);
            }
        }
    }
}