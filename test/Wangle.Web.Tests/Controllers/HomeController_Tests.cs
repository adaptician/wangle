using System.Threading.Tasks;
using Wangle.Models.TokenAuth;
using Wangle.Web.Controllers;
using Shouldly;
using Xunit;

namespace Wangle.Web.Tests.Controllers
{
    public class HomeController_Tests: WangleWebTestBase
    {
        [Fact]
        public async Task Index_Test()
        {
            await AuthenticateAsync(null, new AuthenticateModel
            {
                UserNameOrEmailAddress = "admin",
                Password = "123qwe"
            });

            //Act
            var response = await GetResponseAsStringAsync(
                GetUrl<HomeController>(nameof(HomeController.Index))
            );

            //Assert
            response.ShouldNotBeNullOrEmpty();
        }
    }
}