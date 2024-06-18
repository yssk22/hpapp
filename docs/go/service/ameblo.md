# Ameblo Service

## Commands

### `crawl-urls`

The command crawl the ameblo URLs given in the arguments. The command is useful to crawl specific URLs for debugging or operational purposes.

## Tasks

### CrawlRssFeedsTask

At first, a client (Cloud Scheduler or any other schedulers) calls `CrawlRssFeedsTask` without any parameters. This task identifies the RSS feed URLs from HPAsset table,
which is `http://rssblog.ameba.jp/{key}/rss20.xml` format and fetch RSS XML documents from those URLs. Then it extracts blog post URLs from the RSS XML and then optimize
URLs to crawl by comparing HPAmebloPost entries.

Once the task identify the list of URLs that need to be crawled, it split the list into chunks and then call `CrawlUrlsTask` for each chunk.

### CrawlUrlsTask

This task simply crawls each URL in the argument. It is expected to be called from `CrawlRssFeedsTask` or `crawl-url` command.

### CrawlFlaggedPosts

This is an operational task to crawl specific posts in `HPAmebloPost` ent. For example, if you change the crawling logic and want to update the fields in the older posts,
you can flip `recrawl_required` flag to `TRUE` in ents, and then call this task to crawl those posts.

## See also

- [github.com/yssk22/hpapp/service/helloproject/ameblo](../godoc/pkg/github.com/yssk22/hpapp/go/service/helloproject/ameblo/index.html)
