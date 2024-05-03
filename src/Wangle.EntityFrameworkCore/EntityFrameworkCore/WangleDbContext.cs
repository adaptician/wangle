using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using Wangle.Authorization.Roles;
using Wangle.Authorization.Users;
using Wangle.Designations;
using Wangle.MultiTenancy;

namespace Wangle.EntityFrameworkCore
{
    public class WangleDbContext : AbpZeroDbContext<Tenant, Role, User, WangleDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public virtual DbSet<Designation> Designations { get; set; }
        
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
        }
    }
}
