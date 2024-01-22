using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photos> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UsersFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>().HasKey(aa => new {aa.AppUserId, aa.ActivityId});

            builder.Entity<ActivityAttendee>()
              .HasOne(u => u.AppUser)
              .WithMany(u => u.Activities)
              .HasForeignKey(aa => aa.AppUserId);

             builder.Entity<ActivityAttendee>()
              .HasOne(u => u.Activity)
              .WithMany(u => u.Attendees)
              .HasForeignKey(aa => aa.ActivityId);

            builder.Entity<Comment>()
              .HasOne(a => a.Activity)
              .WithMany(c => c.Comments)
              .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(o => 
            {
               o.HasKey(k => new { k.ObserverId, k.TargetId});

               o.HasOne(o => o.Observer)
                .WithMany(o => o.Followings)
                .HasForeignKey(o => o.ObserverId)
                .OnDelete(DeleteBehavior.Cascade);


              o.HasOne(o => o.Target)
                .WithMany(o => o.Followers)
                .HasForeignKey(o => o.TargetId)
                .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}