using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Comments
{
    public class CommentsDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public int body { get; set; }
        public int UserName { get; set; }
        public int DisplayName { get; set; }
        public int Image { get; set; }
    }
}