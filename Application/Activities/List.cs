using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDtos>>> {}

        public class Handler : IRequestHandler<Query, Result<List<ActivityDtos>>>
        {
            private readonly DataContext _Context;
            private readonly IMapper _mapper;
        
            public Handler(DataContext context, IMapper mapper)
            {
              _mapper = mapper;
              _Context = context;
            }

            public async Task<Result<List<ActivityDtos>>> Handle(Query request, CancellationToken cancellationToken)
            {
                 var activities =  await _Context.Activities
                             //.Include(a => a.Attendees)
                             //.ThenInclude(a => a.AppUser)
                             .ProjectTo<ActivityDtos>(_mapper.ConfigurationProvider)
                             .ToListAsync();

                 //var activitiesToReturn =  _mapper.Map<List<ActivityDtos>>(activities);

                 return Result<List<ActivityDtos>>.Success(activities);
            }
        }
    }
}