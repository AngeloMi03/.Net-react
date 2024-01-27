using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
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
        public class Query : IRequest<Result<PagedList<ActivityDtos>>>
        { 
           public PagingParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDtos>>>
        {
            private readonly DataContext _Context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _Context = context;
            }

            public async Task<Result<PagedList<ActivityDtos>>> Handle(Query request, CancellationToken cancellationToken)
            {

                Console.WriteLine("Params pagenumber" + request.Params.PageNumber);
                Console.WriteLine("Params pagesize" + request.Params.PageSize);
               

                var query = _Context.Activities
                            //.Include(a => a.Attendees)
                            //.ThenInclude(a => a.AppUser)
                            .OrderBy(a => a.Date)
                            .ProjectTo<ActivityDtos>(_mapper.ConfigurationProvider,
                               new { currentUsername = _userAccessor.GetUsername()})
                            .AsQueryable();

                //var activitiesToReturn =  _mapper.Map<List<ActivityDtos>>(activities);

                return Result<PagedList<ActivityDtos>>.Success(
                    await PagedList<ActivityDtos>.createAsync(query, 
                      request.Params.PageNumber, request.Params.PageSize)
                );
            }
        }
    }
}