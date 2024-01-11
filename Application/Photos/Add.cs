using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Domain;
using Microsoft.AspNetCore.Http;
using Persistence;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Domain.Photos>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Domain.Photos>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
                _context = context;
            }

            public async Task<Result<Domain.Photos>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(p => p.Photos)
                  .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if(user == null)  return null;

                var photoUploadResult = await _photoAccessor.AddPhoto(request.File);

                var photo = new Domain.Photos
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                if(!user.Photos.Any(x => x.IsMain))
                {
                    photo.IsMain = true;
                }

                user.Photos.Add(photo);

                var result = await _context.SaveChangesAsync() > 0;

                if(result)  return Result<Domain.Photos>.Success(photo);

                return Result<Domain.Photos>.Failure("Problem adding photo");
            }
        }

    }
}