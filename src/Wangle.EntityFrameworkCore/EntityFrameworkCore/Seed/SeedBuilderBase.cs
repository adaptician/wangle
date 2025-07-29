using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Abp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Wangle.EntityFrameworkCore.Seed;

public abstract class SeedBuilderBase<TObject, TPrimaryKey> 
    where TObject : class, IEntity<TPrimaryKey>
{
    protected readonly WangleDbContext Context;
    
    protected abstract IEnumerable<TObject> DataSource { get; }
    
    protected SeedBuilderBase(WangleDbContext context)
    {
        Context = context;
    }
    
    /// <summary>
    /// Creates the seeds in the db. Does not create duplicates if they exist already.
    /// </summary>
    public abstract void CreateSeeds();
    
    protected virtual void AddOrUpdateSeeds(TObject seedingObject,
        Expression<Func<TObject, bool>> predicate)
    {
        if (Context.Set<TObject>().IgnoreQueryFilters().Any(predicate))
        {
            var dbRecord = Context.Set<TObject>().AsNoTracking().FirstOrDefault(predicate);
            if (dbRecord != null)
            {
                seedingObject.Id = dbRecord.Id;
                Context.Set<TObject>().Update(seedingObject);
            }
        }
        else
        {
            Context.Set<TObject>().Add(seedingObject);
        }

        Context.SaveChanges();
    }
}