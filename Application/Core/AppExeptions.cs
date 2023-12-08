using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class AppExeptions
    {
        public AppExeptions(int status, string message, string details = null)
        {
            Status = status;
            Message = message;
            Details = details;
        }

      public int Status { get; set; }
      public string Message { get; set; }
      public string Details { get; set; }


    }
}