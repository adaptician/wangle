using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;

namespace Wangle.Courses;

[Table(nameof(Course), Schema = EntitySchema.Simulation)]
public class Course : FullAuditedEntity<long>
{
    [Required(AllowEmptyStrings = false)]
    [MaxLength(CourseConsts.MaxNameLength)]
    public string Name { get; set; }
    
    [Required(AllowEmptyStrings = false)]
    [MaxLength(CourseConsts.MaxDescriptionLength)]
    public string Description { get; set; }
}