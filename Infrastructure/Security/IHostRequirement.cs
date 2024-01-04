using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IHostRequirement : IAuthorizationRequirement
    {

    }

    public class IHostRequirementHandler : AuthorizationHandler<IHostRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;

        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Task.CompletedTask;

            var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
                  .FirstOrDefault(x => x.Key == "id").Value?.ToString());
            
            //var attendee = _dbContext.ActivityAttendees
               //.FindAsync(userId, activityId).Result;//this methode keep attendee in memory with findasync

            var attendee = _dbContext.ActivityAttendees
                 .AsNoTracking()
                 .FirstOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId)
                 .Result;

             if (attendee == null) return Task.CompletedTask;

             if(attendee.IsHost) context.Succeed(requirement);  

             return Task.CompletedTask;     
        }
    }
}