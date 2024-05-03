using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;

namespace Wangle.Simulations.Dto;

public class SimulationDto : EntityDto<long>
{
    [Required(AllowEmptyStrings = false)]
    [MaxLength(SimulationConsts.MaxNameLength)]
    public string Name { get; set; }
    
    [Required]
    public string InitialSceneJson { get; set; }
    
    public string ConfigJson { get; set; }
}