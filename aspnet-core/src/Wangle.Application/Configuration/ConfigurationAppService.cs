using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using Wangle.Configuration.Dto;

namespace Wangle.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : WangleAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
