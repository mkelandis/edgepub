# Edgepub

[Micropub](https://www.w3.org/TR/micropub/) implementated as [Cloudflare Edge Worker](https://developers.cloudflare.com/workers/) with [R2 Storage](https://developers.cloudflare.com/r2/). 

Built & Tested using [Micropub Rocks!](https://micropub.rocks/)


## Dependencies
* Cloudflare account
* R2 bucket
* Itty router

## Installation

```sh
$ brew install nvm
$ nvm use
$ npm i

# configure wrangler.toml (see below)
$ npm run deploy
```


### Configuration

wrangler.toml

```toml

[vars]
# host your serving micropub
API_HOST = "pub.hintercraft.com"

# set up a "BUCKET" to store micropub data
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "pub-hintercraft-com"

```

## Storage

### R2 Storage

At this time only R2 storage is supported.

#### Setup
* Create a bucket in the [dashboard](https://dash.cloudflare.com/)
* bucket name must match the binding definition in wrangler.toml - use default settings
* All objects are stored under ``/micropub/...``
* In order to support the undelete action, deleted objects are stored under ``/micropub/deleted/...``

#### Lifecycle rule
Set a policy to permanently delete stuff after 30 days (or whatever time period you like).

* Navigate to Dashboard -> R2 -> {your bucket} -> Settings -> Object lifecycle rules
* Add Rule

```
Rule Name: perma-delete
If object prefix is: micropub/deleted/
Delete uploaded objects after: Days - 30
```

You can also set a policy to abort in-progress uploads sooner.

```
Rule Name: abort-uploads
If object prefix is: micropub/
Abort incomplete multipart uploads after: Days - 1
```


## TODO
* environment and configuration
* storage
* how to link with a hugo blog
* grok syndication
* review microformat documentation

## Documentation
* https://developers.cloudflare.com/r2/api/workers/workers-api-reference/#create-a-binding