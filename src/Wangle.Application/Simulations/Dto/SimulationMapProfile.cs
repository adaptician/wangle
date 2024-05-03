using AutoMapper;

namespace Wangle.Simulations.Dto;

public class SimulationMapProfile : Profile
{
    public SimulationMapProfile()
    {
        CreateMap<Simulation, SimulationDto>();
    }
}