using Application.Activities;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : API.Controllers.BaseApiController
    {
      
        /*private readonly IMediator _mediator;
    
        public ActivitiesController(IMediator mediator )
        {
            _mediator = mediator;
        }*/

       [HttpGet]
       public async Task<IActionResult> GetActivities([FromQuery] ActivityParams param)
       {
           return HandlePagedResult(await Mediator.Send(new List.Query{Params = param}));
       }

       [HttpGet("{id}")]
       public async Task<IActionResult> GetActivity(Guid id)
       {
            //return await _context.Activities.FindAsync(id);
            return HandleResult(await Mediator.Send(new Details.Query(){Id = id}));
       }

       [HttpPost]
       public async Task<IActionResult> CreateActivity(Activity activity)
       {
            return HandleResult(await Mediator.Send(new Create.Commad{Activity = activity}));
       }

       [Authorize(Policy ="IsActivityHost")]
       [HttpPut("{id}")]
       public async Task<IActionResult> EditActivity(Guid id, Activity activity)
       {
           activity.Id = id;
           return HandleResult(await Mediator.Send(new Edit.Commad{Activity = activity}));
       }

        [Authorize(Policy ="IsActivityHost")]
       [HttpDelete("{id}")]
       public async Task<IActionResult> DeleteActivity(Guid id)
       {
           return HandleResult( await Mediator.Send(new Delete.Commad{Id = id}));
       }


       [HttpPost("{id}/attend")]
       public async Task<IActionResult> Atten(Guid id)
       {
           return HandleResult( await Mediator.Send(new UpdateAttendence.Command{Id = id}));
       }
    }
}