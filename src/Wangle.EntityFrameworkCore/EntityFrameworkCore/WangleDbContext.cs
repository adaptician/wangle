using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using Wangle.Authorization.Roles;
using Wangle.Authorization.Users;
using Wangle.Courses;
using Wangle.Designations;
using Wangle.MultiTenancy;
using Wangle.Simulations;

namespace Wangle.EntityFrameworkCore
{
    public class WangleDbContext : AbpZeroDbContext<Tenant, Role, User, WangleDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public virtual DbSet<Designation> Designations { get; set; }
        
        public virtual DbSet<Course> Courses { get; set; }
        public virtual DbSet<CourseParticipant> CourseParticipants { get; set; }
        
        public virtual DbSet<Simulation> Simulations { get; set; }
        public virtual DbSet<SimulationParticipant> SimulationParticipants { get; set; }
        
        public WangleDbContext(DbContextOptions<WangleDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Designation>(b =>
            {
                b.HasIndex(e => new { e.Key }).IsUnique();
            });
            
            modelBuilder.Entity<CourseParticipant>(b =>
            {
                b.HasIndex(e => new { e.CourseId, e.UserId }).IsUnique().HasFilter("[IsDeleted] = 0");
            });
            
            modelBuilder.Entity<SimulationParticipant>(b =>
            {
                b.HasIndex(e => new { e.SimulationId, e.UserId }).IsUnique();
            });
        }
    }
}
