using System.ComponentModel.DataAnnotations;

namespace Wangle.Simulations.Dto;

public class CreateSimulationDto
{
    [Required(AllowEmptyStrings = false)]
    [MaxLength(SimulationConsts.MaxNameLength)]
    public string Name { get; set; }
    
    [Required]
    public string InitialSceneJson { get; set; }
    
    public string ConfigJson { get; set; }
}