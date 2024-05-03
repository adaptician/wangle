using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using Wangle.Authorization.Roles;
using Wangle.Authorization.Users;
using Wangle.MultiTenancy;

namespace Wangle.EntityFrameworkCore
{
    public class WangleDbContext : AbpZeroDbContext<Tenant, Role, User, WangleDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public WangleDbContext(DbContextOptions<WangleDbContext> options)
            : base(options)
        {
        }
    }
}
