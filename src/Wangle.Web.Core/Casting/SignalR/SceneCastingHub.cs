using System;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Runtime.Session;
using Castle.Core.Logging;
using Microsoft.AspNetCore.SignalR;

namespace Wangle.Casting.SignalR
{
    public class SceneCastingHub : Hub, ITransientDependency
    {
        public IAbpSession AbpSession { get; set; }

        public ILogger Logger { get; set; }
        
        public SceneCastingHub()
        {
            AbpSession = NullAbpSession.Instance;
            Logger = NullLogger.Instance;
        }
        
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            Logger.Debug("A client connected to SceneCastingHub: " + Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
            Logger.Debug("A client disconnected from SceneCastingHub: " + Context.ConnectionId);
        }
        
        public async Task AddToGroup(string groupName, string username)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("groupNotice", $"{username} has joined the group {groupName}.");
        }

        public async Task RemoveFromGroup(string groupName, string username)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

            await Clients.Group(groupName).SendAsync("groupNotice", $"{username} has left the group {groupName}.");
        }
        
        public async Task SetIsCasting(bool isCasting, string groupName)
        {
            await Clients.Group(groupName).SendAsync("castingChecked", isCasting);
        }
        
        public async Task CastToGroup(string castingJson, string groupName)
        {
            await Clients.Group(groupName).SendAsync("receiveCasting", castingJson);
        }
    }
}