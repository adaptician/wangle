using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Wangle.Designations;

[Table(nameof(Designation), Schema = EntitySchema.Simulation)]
public class Designation : FullAuditedEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public override int Id { get; set; }
    
    [Required(AllowEmptyStrings = false)]
    [MaxLength(DesignationConsts.MaxKeyLength)]
    public string Key { get; set; }
    
    [Required(AllowEmptyStrings = false)]
    [MaxLength(DesignationConsts.MaxNameLength)]
    public string Name { get; set; }
}