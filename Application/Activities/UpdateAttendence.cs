using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendence
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _dataContext;

            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;

            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var Activities = await _dataContext.Activities
                                   .Include(a => a.Attendees).ThenInclude(a => a.AppUser)
                                   .SingleOrDefaultAsync(x => x.Id == request.Id);

                if (Activities == null) return null;

                var user = await _dataContext.Users
                            .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                var HostUserName = Activities.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                var Attendence = Activities.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if(Attendence != null && HostUserName == user.UserName)
                    Activities.IsCancelled = !Activities.IsCancelled;

                if(Attendence != null && HostUserName != user.UserName)
                    Activities.Attendees.Remove(Attendence);

                if(Attendence == null )
                {
                    Attendence =  new ActivityAttendee
                    {
                      AppUser = user,
                      Activity = Activities,
                      IsHost = false
                    };

                    Activities.Attendees.Add(Attendence);
                }

                var result = await _dataContext.SaveChangesAsync() > 0;

                return result 
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("probleme to update attendence");
                
                    
            }
        }
    }
}