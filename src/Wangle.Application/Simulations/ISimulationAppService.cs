using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Wangle.Simulations.Dto;

namespace Wangle.Simulations;

public interface ISimulationAppService : IAsyncCrudAppService<SimulationDto, long, PagedSimulationResultRequestDto, CreateSimulationDto, SimulationEditDto>
{
    Task<SimulationDto> JoinAsync(GetSimulationInput input);

    Task LeaveAsync(GetSimulationInput input);

    Task<IEnumerable<SimulationParticipantDto>> GetParticpants(GetSimulationInput input);
}