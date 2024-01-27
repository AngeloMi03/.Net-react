using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PagedList<T> : List<T>
    {
        public PagedList(IEnumerable<T> items, int count, int PageNumber, int pageSize)
        {
            CurrentPage = PageNumber;
            TotalPage = (int)Math.Ceiling(count/(double)pageSize);
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }

        public int CurrentPage { get; set; }
        public int TotalPage { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PagedList<T>> createAsync(IQueryable<T> source, int PageNumber, int PageSize)
        {
             var count = await source.CountAsync();
             var items = await source.Skip((PageNumber - 1) * PageSize).Take(PageSize).ToListAsync();

             return new PagedList<T>(items, count,PageNumber, PageSize);
        }

    }
}