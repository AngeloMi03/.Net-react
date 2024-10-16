using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.signalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command Command)
        {
           var comment = await _mediator.Send(Command);

           await Clients.Group(Command.ActivityId.ToString())
             .SendAsync("ReceiveComment", comment.Value);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext.Request.Query["activityId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);
            var result = await _mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)});

           Console.Write("result connection hub  " + result.Value);
           Console.Write("result connection activityId " + activityId );

            await Clients.Caller.SendAsync("LoadComments", result.Value);
        }
    }
}