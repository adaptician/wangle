﻿using System;

namespace Wangle.Chat.Dto;

public class ChatMessageDto
{
    public string Username { get; set; }
    
    public string Message { get; set; }
    
    public DateTime Timestamp { get; set; }
}