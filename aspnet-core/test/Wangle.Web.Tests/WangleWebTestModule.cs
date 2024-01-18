using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Wangle.EntityFrameworkCore;
using Wangle.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace Wangle.Web.Tests
{
    [DependsOn(
        typeof(WangleWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class WangleWebTestModule : AbpModule
    {
        public WangleWebTestModule(WangleEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(WangleWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(WangleWebMvcModule).Assembly);
        }
    }
}