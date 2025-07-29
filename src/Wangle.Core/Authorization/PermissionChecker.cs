using Abp.Authorization;
using Wangle.Authorization.Roles;
using Wangle.Authorization.Users;

namespace Wangle.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
