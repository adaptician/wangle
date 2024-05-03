using System.Collections.Generic;
using Wangle.Designations;

namespace Wangle.EntityFrameworkCore.Seed.Designations;

public class DesignationBuilder : SeedBuilderBase<Designation, int>
{
    public DesignationBuilder(WangleDbContext context) 
        : base(context)
    {
    }
    
    
    protected override IEnumerable<Designation> DataSource => new List<Designation>
    {
        new Designation
        {
            Id = (int) DesignationOption.Moderator,
            Key = DesignationOption.Moderator.ToString(),
            Name = DesignationOption.Moderator.ToString(),
        },
        new Designation
        {
            Id = (int) DesignationOption.Facilitator,
            Key = DesignationOption.Facilitator.ToString(),
            Name = DesignationOption.Facilitator.ToString(),
        },
        new Designation
        {
            Id = (int) DesignationOption.Mediator,
            Key = DesignationOption.Mediator.ToString(),
            Name = DesignationOption.Mediator.ToString(),
        },
        new Designation
        {
            Id = (int) DesignationOption.Assistant,
            Key = DesignationOption.Assistant.ToString(),
            Name = DesignationOption.Assistant.ToString(),
        },
        new Designation
        {
            Id = (int) DesignationOption.Attendee,
            Key = DesignationOption.Attendee.ToString(),
            Name = DesignationOption.Attendee.ToString(),
        },
    };

    public override void CreateSeeds()
    {
        foreach (var data in DataSource)
        {
            AddOrUpdateSeeds(data, s => s.Id == data.Id);
        }
    }

}