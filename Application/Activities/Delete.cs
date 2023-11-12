using System;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Commad : IRequest 
        {
            public Guid Id { get; set; }
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
                   var activity = _context.Activities.FindAsync(request.Id);

                   _context.Remove(activity);

                   await _context.SaveChangesAsync();

                   return Unit.Value;
            }
        }
    }
}