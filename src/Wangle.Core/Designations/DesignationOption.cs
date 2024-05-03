using System.ComponentModel;

namespace Wangle.Designations;

public enum DesignationOption
{
    [Description("Moderator")]
    Moderator = 10,
    [Description("Facilitator")]
    Facilitator = 20,
    [Description("Mediator")]
    Mediator = 30,
    [Description("Assistant")]
    Assistant = 40,
    [Description("Attendee")]
    Attendee = 50,
}