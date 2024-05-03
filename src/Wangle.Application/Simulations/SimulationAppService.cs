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
        var user = await this._userManager.GetUserByIdAsync(userId);

        var isStudent = await this._userManager.IsInRoleAsync(user, "Student");

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
        var participantTask = this._simulationParticipantRepository.InsertOrUpdateAsync(particpant);
        
        await Task.WhenAll(simulationTask, participantTask);

        return ObjectMapper.Map<SimulationDto>(simulationTask.Result);
    }

    public async Task LeaveAsync(GetSimulationInput input)
    {
        // get user from session
        var userId = AbpSession.GetUserId();
        
        // remove user to participant list
        var particpant = new SimulationParticipant()
        {
            SimulationId = input.Id,
            UserId = userId
        };
        await this._simulationParticipantRepository.DeleteAsync(particpant);
    }

    public async Task<IEnumerable<SimulationParticipantDto>> GetParticpants(GetSimulationInput input)
    {
        // get user from session
        var userId = AbpSession.GetUserId();
        
        // TODO: additional info based on role and designation

        var participants = await this._simulationParticipantRepository.GetAll()
            .Where(x => x.SimulationId == input.Id)
            .Select(x => ObjectMapper.Map<SimulationParticipantDto>(x))
            .ToListAsync();

        return participants;
    }
}