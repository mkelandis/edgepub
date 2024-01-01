import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { UnstableDevWorker } from "wrangler";
import { Worker } from "../../vitest.setup";

describe("Post", () => {

  let worker: UnstableDevWorker;
  beforeEach(async () => {
    worker = await Worker.getInstance();
  });

  it("should return a 201", async () => {
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