using Abp.Application.Features;
using Abp.Localization;
using Abp.UI.Inputs;

namespace Wangle.Features;

public class WangleFeatureProvider : FeatureProvider
{
    public override void SetFeatures(IFeatureDefinitionContext context)
    {
        context.Create(
            WangleFeatures.SimulationsFeature,
            defaultValue: "false",
            displayName: L("SimulationsFeature"),
            description: L("SimulationsFeatureDescription"),
            inputType: new CheckboxInputType()
        );
    }
    
    private static ILocalizableString L(string name)
    {
        return new LocalizableString(name, WangleConsts.LocalizationSourceName);
    }  
}