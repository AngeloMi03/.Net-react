using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;

namespace Application.Comments
{
    public class List
    {
        public class Query : IRequest<Result<List<CommentsDto>>>
        {
            public Guid ActivityId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<CommentsDto>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<CommentsDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = await _context.Comments
                   .Where(x => x.Activity.Id == request.ActivityId)
                   .OrderByDescending(x => x.CreatedAt)
                  .ProjectTo<CommentsDto>(_mapper.ConfigurationProvider)
                  .ToListAsync();

              Console.WriteLine("comment"+ comments);
              return Result<List<CommentsDto>>.Success(comments);

            }
        }
    }
}