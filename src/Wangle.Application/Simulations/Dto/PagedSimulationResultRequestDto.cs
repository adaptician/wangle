using Abp.Application.Services.Dto;

namespace Wangle.Simulations.Dto;

public class PagedSimulationResultRequestDto : PagedResultRequestDto
{
    public string Keyword { get; set; }
}