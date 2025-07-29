using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Wangle.Authorization.Users;

namespace Wangle.Courses;

/// <summary>
/// A course is a type pf learning module, and participants are either educators or enrolled students.
///
/// A moderator or assistant teacher may be a participant in a simulation, but may not necessarily appear here.
/// </summary>
[Table(nameof(CourseParticipant), Schema = EntitySchema.Simulation)]
public class CourseParticipant : FullAuditedEntity<long>
{
    public long CourseId { get; set; }
    
    [ForeignKey(nameof(CourseId))]
    public virtual Course Course { get; set; }
    
    public long UserId { get; set; }
    
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; }
}