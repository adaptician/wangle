using System;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Runtime.Session;
using Castle.Core.Logging;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Wangle.Chat.Dto;

namespace Wangle.Chat.SignalR
{
    public class ChatHub : Hub, ITransientDependency
    {
        public IAbpSession AbpSession { get; set; }

        public ILogger Logger { get; set; }

        public ChatHub()
        {
            AbpSession = NullAbpSession.Instance;
            Logger = NullLogger.Instance;
        }

        public async Task SendMessage(string message, string username)
        {
            var messageData = new ChatMessageDto()
            {
                Username = username,
                Message = message,
                Timestamp = DateTime.Now,
            };
            await Clients.All.SendAsync("receiveMessage", JsonConvert.SerializeObject(messageData));
        }
        
        public async Task SendGroupMessage(string message, string groupName, string username)
        {
            var messageData = new ChatMessageDto()
            {
                Username = username,
                Message = message,
                Timestamp = DateTime.Now,
            };
            await Clients.Group(groupName).SendAsync("receiveMessage", JsonConvert.SerializeObject(messageData));
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            Logger.Debug("A client connected to MyChatHub: " + Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
            Logger.Debug("A client disconnected from MyChatHub: " + Context.ConnectionId);
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
    }
}