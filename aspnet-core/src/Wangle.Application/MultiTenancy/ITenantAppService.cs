using Abp.Application.Services;
using Wangle.MultiTenancy.Dto;

namespace Wangle.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

