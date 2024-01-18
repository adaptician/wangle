using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Wangle.Authorization;

namespace Wangle
{
    [DependsOn(
        typeof(WangleCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class WangleApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<WangleAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(WangleApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
