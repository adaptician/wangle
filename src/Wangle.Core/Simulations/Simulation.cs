using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Wangle.Simulations;

[Table(nameof(Simulation), Schema = EntitySchema.Simulation)]
public class Simulation : FullAuditedEntity<long>
{
    [Required(AllowEmptyStrings = false)]
    [MaxLength(SimulationConsts.MaxNameLength)]
    public string Name { get; set; }
    
    [Required(AllowEmptyStrings = false)]
    public string InitialSceneJson { get; set; }
    
    public string ConfigJson { get; set; }
}