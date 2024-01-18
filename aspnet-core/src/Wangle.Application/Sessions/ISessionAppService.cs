using System.Threading.Tasks;
using Abp.Application.Services;
using Wangle.Sessions.Dto;

namespace Wangle.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
