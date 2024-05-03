using Abp.Application.Features;
using Abp.Authorization;
using Abp.Localization;
using Abp.MultiTenancy;
using Wangle.Features;

namespace Wangle.Authorization
{
    public class WangleAuthorizationProvider : AuthorizationProvider
    {
        public override void SetPermissions(IPermissionDefinitionContext context)
        {
            context.CreatePermission(PermissionNames.Pages_Users, L("Users"));
            context.CreatePermission(PermissionNames.Pages_Users_Activation, L("UsersActivation"));
            context.CreatePermission(PermissionNames.Pages_Roles, L("Roles"));
            context.CreatePermission(PermissionNames.Pages_Tenants, L("Tenants"), multiTenancySides: MultiTenancySides.Host);
            
            // SIMULATIONS
            var virtualClassrooms = context.CreatePermission(PermissionNames.Pages_Simulations, L("PermissionSimulations"),
                multiTenancySides: MultiTenancySides.Tenant,
                featureDependency: new SimpleFeatureDependency(WangleFeatures.SimulationsFeature));
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, WangleConsts.LocalizationSourceName);
        }
    }
}
