using System.Threading.Tasks;
using Abp.Application.Services;
using Wangle.Authorization.Accounts.Dto;

namespace Wangle.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
