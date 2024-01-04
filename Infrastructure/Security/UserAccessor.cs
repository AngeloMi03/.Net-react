using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        public readonly IHttpContextAccessor _HttpContextAccessor;
        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _HttpContextAccessor = httpContextAccessor;
            
        }
        public string GetUsername()
        {
           return _HttpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
        }
    }
}