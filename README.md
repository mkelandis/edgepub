# Edgepub
[Micropub](https://micropub.rocks) implementated as [Cloudflare Edge Worker](https://developers.cloudflare.com/workers/) 

## Dependencies
* Cloudflare account
* R2 bucket
* Itty router

## Installation

### Configuration

```toml

[vars]

# host your serving micropub
API_HOST = "pub.hintercraft.com"


```


## Storage

### R2 Storage

At this time only R2 storage is supported.

#### Setup
* Create a bucket in the [dashboard](https://dash.cloudflare.com/)
* bucket name must match the binding definition in wrangler.toml - use default settings



## TODO
* environment and configuration
* storage
* how to link with a hugo blog
* grok syndication
* review microformat documentation

## Documentation
* https://developers.cloudflare.com/r2/api/workers/workers-api-reference/#create-a-binding