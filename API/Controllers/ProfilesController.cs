using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.ProfileUser;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query{UserName = username}));
        }


        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUseActivity(string username, [FromQuery] string predicate)
        {
            return HandleResult(await Mediator.Send(
                new ListActivities.Query{UserName = username, Predicate = predicate}));
        }
    }
}