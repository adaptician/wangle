using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Wangle.EntityFrameworkCore
{
    public static class WangleDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<WangleDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<WangleDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
