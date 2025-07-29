using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace Wangle.Controllers
{
    public abstract class WangleControllerBase: AbpController
    {
        protected WangleControllerBase()
        {
            LocalizationSourceName = WangleConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
