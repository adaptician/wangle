using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Wangle.Authorization.Users;
using Wangle.Designations;

namespace Wangle.Simulations;

/// <summary>
/// Simulation participants are initialised based upon course participants, but additional users can be added
/// to a simulation as required. This may not be significant or relevant to the course enrollment.
///
/// Simulation participant entities will change continuously and so are not fully audited.
/// </summary>
[Table(nameof(SimulationParticipant), Schema = EntitySchema.Simulation)]
public class SimulationParticipant : Entity<long>
{
    public long SimulationId { get; set; }
    
    [ForeignKey(nameof(SimulationId))]
    public virtual Simulation Simulation { get; set; }
    
    public long UserId { get; set; }
    
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; }
    
    public int DesignationId { get; set; }
    
    // Designation would need to be implemented with greater sophistication, so that permissions could apply as easily
    // as with the built-in roles, and yet they should only endure for the lifetime of the simulation.
    [ForeignKey(nameof(DesignationId))]
    public virtual Designation Designation { get; set; }
}