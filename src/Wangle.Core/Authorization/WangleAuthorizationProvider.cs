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
            var simulations = context.CreatePermission(PermissionNames.Pages_Simulations, 
                L("PermissionToSimulations"),
                multiTenancySides: MultiTenancySides.Tenant,
                featureDependency: new SimpleFeatureDependency(WangleFeatures.SimulationsFeature));
            
            simulations.CreateChildPermission(PermissionNames.Pages_Simulations_View, 
                L("PermissionToSimulationsView"),
                multiTenancySides: MultiTenancySides.Tenant,
                featureDependency: new SimpleFeatureDependency(WangleFeatures.SimulationsFeature));
            
            // CONTROL
            var simulationsControl = simulations.CreateChildPermission(PermissionNames.Pages_Simulations_Control, 
                L("PermissionToSimulationsControl"),
                multiTenancySides: MultiTenancySides.Tenant,
                featureDependency: new SimpleFeatureDependency(WangleFeatures.SimulationsFeature));
            
            simulationsControl.CreateChildPermission(PermissionNames.Pages_Simulations_Control_Request, 
                L("PermissionToSimulationsControlRequest"),
                multiTenancySides: MultiTenancySides.Tenant,
                featureDependency: new SimpleFeatureDependency(WangleFeatures.SimulationsFeature));
            
            simulationsControl.CreateChildPermission(PermissionNames.Pages_Simulations_Control_Assume, 
                L("PermissionToSimulationsControlAssume"),
                multiTenancySides: MultiTenancySides.Tenant,
                featureDependency: new SimpleFeatureDependency(WangleFeatures.SimulationsFeature));
            
            simulationsControl.CreateChildPermission(PermissionNames.Pages_Simulations_Control_Interact, 
                L("PermissionToSimulationsControlInteract"),
                multiTenancySides: MultiTenancySides.Tenant,
                featureDependency: new SimpleFeatureDependency(WangleFeatures.SimulationsFeature));
            
            // MEDIATION
            var simulationsMediation = simulations.CreateChildPermission(PermissionNames.Pages_Simulations_Mediate, 
                L("PermissionToSimulationsMediate"),
                multiTenancySides: MultiTenancySides.Tenant,
                featureDependency: new SimpleFeatureDependency(WangleFeatures.SimulationsFeature));
            
            simulationsMediation.CreateChildPermission(PermissionNames.Pages_Simulations_Mediate_View, 
                L("PermissionToSimulationsMediateView"),
                multiTenancySides: MultiTenancySides.Tenant,
                featureDependency: new SimpleFeatureDependency(WangleFeatures.SimulationsFeature));
            
            simulationsMediation.CreateChildPermission(PermissionNames.Pages_Simulations_Mediate_Participant_Grant, 
                L("PermissionToSimulationsMediateParticipantGrant"),
                multiTenancySides: MultiTenancySides.Tenant,
                featureDependency: new SimpleFeatureDependency(WangleFeatures.SimulationsFeature));
            
            simulationsMediation.CreateChildPermission(PermissionNames.Pages_Simulations_Mediate_Participant_Evict, 
                L("PermissionToSimulationsMediateParticipantEvict"),
                multiTenancySides: MultiTenancySides.Tenant,
                featureDependency: new SimpleFeatureDependency(WangleFeatures.SimulationsFeature));
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, WangleConsts.LocalizationSourceName);
        }
    }
}
