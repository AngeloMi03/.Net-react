using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {

            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            public Handler(DataContext context,IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var Observer = await _context.Users
                   .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                var Target = await _context.Users
                   .FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

                if(Target == null) return null;

                var following = await _context.UsersFollowings.FindAsync(Observer.Id, Target.Id);

                if(following == null)
                {
                    following = new Domain.UserFollowing
                    {
                        Target = Target,
                        Observer = Observer
                    };

                    _context.UsersFollowings.Add(following);
                }else
                {
                    _context.UsersFollowings.Remove(following);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if(success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem updating follow");
            }
        }
    }
}