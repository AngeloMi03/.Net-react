using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Core;

namespace API.middleware
{
    public class ExeptionMiddleware
    {
        private readonly RequestDelegate _next;
         private readonly IHostEnvironment _env;
         private readonly ILogger<ExeptionMiddleware> _logger;
        public ExeptionMiddleware(RequestDelegate next, ILogger<ExeptionMiddleware> logger, IHostEnvironment env)
        {
            _logger = logger;
            _env = env;
            _next = next;
            
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                
              _logger.LogError(ex, ex.Message);
              context.Response.ContentType = "application/json";
              context.Response.StatusCode= (int)HttpStatusCode.InternalServerError;

              var response = _env.IsDevelopment() 
                ?  new AppExeptions(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                :  new AppExeptions(context.Response.StatusCode,"Internal Server Error");

            var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

            var json = JsonSerializer.Serialize(response, options);

            await context.Response.WriteAsync(json);
              
            }
        }
    }
}