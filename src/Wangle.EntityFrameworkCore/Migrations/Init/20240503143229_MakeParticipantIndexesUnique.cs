using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wangle.Migrations
{
    /// <inheritdoc />
    public partial class MakeParticipantIndexesUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SimulationParticipant_SimulationId_UserId",
                schema: "sim",
                table: "SimulationParticipant");

            migrationBuilder.DropIndex(
                name: "IX_CourseParticipant_CourseId_UserId",
                schema: "sim",
                table: "CourseParticipant");

            migrationBuilder.CreateIndex(
                name: "IX_SimulationParticipant_SimulationId_UserId",
                schema: "sim",
                table: "SimulationParticipant",
                columns: new[] { "SimulationId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CourseParticipant_CourseId_UserId",
                schema: "sim",
                table: "CourseParticipant",
                columns: new[] { "CourseId", "UserId" },
                unique: true,
                filter: "[IsDeleted] = 0");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SimulationParticipant_SimulationId_UserId",
                schema: "sim",
                table: "SimulationParticipant");

            migrationBuilder.DropIndex(
                name: "IX_CourseParticipant_CourseId_UserId",
                schema: "sim",
                table: "CourseParticipant");

            migrationBuilder.CreateIndex(
                name: "IX_SimulationParticipant_SimulationId_UserId",
                schema: "sim",
                table: "SimulationParticipant",
                columns: new[] { "SimulationId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_CourseParticipant_CourseId_UserId",
                schema: "sim",
                table: "CourseParticipant",
                columns: new[] { "CourseId", "UserId" },
                filter: "[IsDeleted] = 0");
        }
    }
}
