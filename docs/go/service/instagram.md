# Instagram Service

Instagram service is built on top of [APIFY](https://apify.com/) scarper.

## What to do when a HPMember starts a new instagram account. 

- Member service will automatically detect and create HPAsset record when the account link is visible on helloproject.com. 
- The initial state of HPAsset doesn't have a Edge connection to HPMember so you need to manually update the connection by using `ig resolve-assets` command.
- You also need to update `Instagram Profile Scraper` task to include the new account at [Apify](https://console.apify.com/)
- Once a scraper task is updated and the first run is done, then run `tasks /helloproject/ig/crawl-latest` to fetch the scraped results from Apify. 

## Commands

### `resolve-assets`

Our [member service](./member.md) automatically detects the new Instagram account as an HPAsset but it is not connected with HPMember account so you need to manually connect them.
To do this, we have a command `resolve-assets` that resolves the Instagram account with the HPMember account so that Instgram posts get avaialble on the HPMember feed.

````bash
$ go run ./cmd/ --prod ig resolve-assets
Following connections will be created:
>>
IG Account                HPMember
rio_kitagawa.official     8589934603
homare__okamura.official  8589934604
mei_yamazaki.official     8589934605
yuumi__kasai.official     8589934675
shiori_yagi.official      8589934676
marine_fukuda.official    8589934677
rin_kawana.official       8589934669
shion_tamenaga.official   8589934670
risa_irie.official        8589934673
<<
Commit connections (y/N)> y
````

Note that the command rely on their Instagram account name convension, which is `{first_name}_{last_name}.official`. If there is an account that doesn't follow this convension, you need to manually connect them.

## Tasks

### CrawlLatestTask

### CrawlBackfillTask

## See also

- [github.com/yssk22/hpapp/service/helloproject/ig](../godoc/pkg/github.com/yssk22/hpapp/go/service/helloproject/ig/index.html)
