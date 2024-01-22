using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using FluentValidation;
using MediatR;
using Persistence;
using AutoMapper;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Domain;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentsDto>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentsDto>>
        {
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }

            public async Task<Result<CommentsDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var actitivy = await _context.Activities.FindAsync(request.ActivityId);

                if(actitivy == null) return null;

                var user = await _context.Users
                   .Include(x => x.Photos)
                   .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                var comment = new Comment
                {
                    Author = user,
                    Activity = actitivy,
                    Body = request.Body
                };

                actitivy.Comments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Result<CommentsDto>.Success(_mapper.Map<CommentsDto>(comment));

                return Result<CommentsDto>.Failure("Failed to add comment");
            }
        }
    }
}