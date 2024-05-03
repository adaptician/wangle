using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Wangle.Designations;

/// <summary>
/// A designation is a role that is specific to a single simulation session, rather than system-wide.
/// </summary>
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