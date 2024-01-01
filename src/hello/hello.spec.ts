import { describe, it, expect, beforeEach } from "vitest";
import { Worker } from "../../vitest.setup";
import { UnstableDevWorker } from "wrangler";

describe("Worker", () => {

  let worker: UnstableDevWorker;
  beforeEach(async () => {
    worker = await Worker.getInstance();
  });

  it("should return Hello World", async () => {
    const resp = await worker.fetch('/hello.html');
    if (resp) {
      const text = await resp.text();
      expect(text).toMatchInlineSnapshot(`"Hello, world!"`);
    }
  });
});