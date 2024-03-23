import { describe, it, expect, beforeEach } from "vitest";
import { UnstableDevWorker } from "wrangler";
import { Worker } from "../../vitest.setup";

describe("Post", () => {

  let worker: UnstableDevWorker;
  beforeEach(async () => {
    worker = await Worker.getInstance();
  });

  it("101: should return a 201", async () => {
    const resp = await worker.fetch('/micropub', {
      method: 'POST',
      body: 'h=entry&content=Hello World!',      
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      }
    });

    const status = resp.status;
    const location = resp.headers.get('Location');

    console.log('resp', {status, location});

    expect(status).toBe(201);
    expect(location?.startsWith('https://pub.hintercraft.com/micropub/entries')).toBeTruthy();
  });

  it('101: Create an h-entry post with multiple categories (form-encoded)', async () => {
    const resp = await worker.fetch('/micropub', {
      method: 'POST',
      body: 'h=entry&content=Hello World!',        
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      }
    });

    const status = resp.status;
    const location = resp.headers.get('Location');

    console.log('resp', {status, location});

    expect(status).toBe(201);
    expect(location?.startsWith('https://pub.hintercraft.com/micropub/entries')).toBeTruthy();

  });

});