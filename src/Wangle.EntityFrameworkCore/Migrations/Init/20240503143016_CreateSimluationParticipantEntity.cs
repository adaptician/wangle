using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wangle.Migrations
{
    /// <inheritdoc />
    public partial class CreateSimluationParticipantEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SimulationParticipant",
                schema: "sim",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SimulationId = table.Column<long>(type: "bigint", nullable: false),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    DesignationId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SimulationParticipant", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SimulationParticipant_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SimulationParticipant_Designation_DesignationId",
                        column: x => x.DesignationId,
                        principalSchema: "sim",
                        principalTable: "Designation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SimulationParticipant_Simulation_SimulationId",
                        column: x => x.SimulationId,
                        principalSchema: "sim",
                        principalTable: "Simulation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SimulationParticipant_DesignationId",
                schema: "sim",
                table: "SimulationParticipant",
                column: "DesignationId");

            migrationBuilder.CreateIndex(
                name: "IX_SimulationParticipant_SimulationId_UserId",
                schema: "sim",
                table: "SimulationParticipant",
                columns: new[] { "SimulationId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_SimulationParticipant_UserId",
                schema: "sim",
                table: "SimulationParticipant",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SimulationParticipant",
                schema: "sim");
        }
    }
}
