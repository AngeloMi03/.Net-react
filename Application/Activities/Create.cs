using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Commad : IRequest 
        {
            public Activity  Activity { get; set; }
        }

        public class Handler : IRequestHandler<Commad>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
               _context = context;
            }

            public async Task<Unit> Handle(Commad request, CancellationToken cancellationToken)
            {
                  _context.Activities.Add(request.Activity);

                  await _context.SaveChangesAsync();

                  return Unit.Value;
            }
        }
    }
}