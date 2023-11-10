using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : API.Controllers.BaseApiController
    {
      
        private readonly DataContext _context;

        public ActivitiesController(DataContext context)
        {
            this._context = context;
        }

       [HttpGet]
       public async Task<ActionResult<List<Domain.Activity>>> GetActivities()
       {
            return await _context.Activities.ToListAsync();
       }

       [HttpGet("{id}")]
       public async Task<ActionResult<Domain.Activity>> GetActivity(int id)
       {
            return await _context.Activities.FindAsync(id);
       }
    }
}