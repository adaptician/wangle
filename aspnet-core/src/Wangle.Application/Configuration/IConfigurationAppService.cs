using System.Threading.Tasks;
using Wangle.Configuration.Dto;

namespace Wangle.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
