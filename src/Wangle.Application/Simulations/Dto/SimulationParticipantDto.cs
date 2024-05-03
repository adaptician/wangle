using Abp.Application.Services.Dto;

namespace Wangle.Simulations.Dto;

public class SimulationParticipantDto : EntityDto<long>
{
    public long ClassroomId { get; set; }
    
    public long UserId { get; set; }
}