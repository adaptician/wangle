using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wangle.Migrations
{
    /// <inheritdoc />
    public partial class AddVirtualClassroomFeature : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(CreateVirtualClassroomFeature);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(DeleteVirtualClassroomFeature);
        }

        #region UP

        private const string CreateVirtualClassroomFeature = @"
insert into AbpFeatures 
(CreationTime, CreatorUserId, Discriminator, Name, Value, TenantId)
values
(
'2024-07-14 16:00:00.0000000',
1,
'TenantFeatureSetting',
'WangleLite.VirtualClassroom',
'True',
1
)
";

        #endregion

        #region DOWN

        private const string DeleteVirtualClassroomFeature = @"
delete from AbpFeatures where Discriminator = 'TenantFeatureSetting' 
                          and Name = 'WangleLite.VirtualClassroom'
                          and TenantId = 1
                          ";

        #endregion
    }
}
