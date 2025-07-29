using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Microsoft.EntityFrameworkCore;
using Wangle.Authorization;
using Wangle.Authorization.Users;
using Wangle.Designations;
using Wangle.Simulations.Dto;

namespace Wangle.Simulations;

[AbpAuthorize(PermissionNames.Pages_Simulations)]
public class SimulationAppService : 
    AsyncCrudAppService<Simulation, SimulationDto, long, PagedSimulationResultRequestDto, CreateSimulationDto, SimulationEditDto>, 
    ISimulationAppService
{
    private readonly UserManager _userManager;
    private readonly IRepository<SimulationParticipant, long> _simulationParticipantRepository;

    public SimulationAppService(IRepository<Simulation, long> simulationRepository, 
        UserManager userManager,
        IRepository<SimulationParticipant, long> simulationParticipantRepository) :
        base(simulationRepository)
    {
        _userManager = userManager;
        _simulationParticipantRepository = simulationParticipantRepository;
    }
    
    public async Task<SimulationDto> JoinAsync(GetSimulationInput input)
    {
        // get user from session
        var userId = AbpSession.GetUserId();
        var user = await _userManager.GetUserByIdAsync(userId);

        var isStudent = await _userManager.IsInRoleAsync(user, "Student");

        // get Simulation
        var simulationTask = base.Repository.GetAll()
            .FirstOrDefaultAsync(x => x.Id == input.Id);

        // add user to participant list
        var particpant = new SimulationParticipant
        {
            SimulationId = input.Id,
            UserId = userId,
            DesignationId = isStudent ? (int) DesignationOption.Attendee : (int) DesignationOption.Facilitator
        };
        var participantTask = _simulationParticipantRepository.InsertOrUpdateAsync(particpant);
        
        await Task.WhenAll(simulationTask, participantTask);

        return ObjectMapper.Map<SimulationDto>(simulationTask.Result);
    }

    public async Task LeaveAsync(GetSimulationInput input)
    {
        var userId = AbpSession.GetUserId();
        
        var participant = await _simulationParticipantRepository
            .FirstOrDefaultAsync(x => x.SimulationId == input.Id && x.UserId == userId);

        if (participant == null)
        {
            return;
        }
        
        await _simulationParticipantRepository.DeleteAsync(participant);
    }

    public async Task<IEnumerable<SimulationParticipantDto>> GetParticpants(GetSimulationInput input)
    {
        var participants = await _simulationParticipantRepository.GetAll()
            .Where(x => x.SimulationId == input.Id)
            .Select(x => ObjectMapper.Map<SimulationParticipantDto>(x))
            .ToListAsync();

        return participants;
    }
}