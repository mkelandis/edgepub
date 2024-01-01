import { UnstableDevWorker, unstable_dev } from "wrangler";

export default async function setup() {
  console.log('setup');
  return teardown;
}

async function teardown(): Promise<void> {
  console.log('teardown');
  return Worker.stop();
} 

export class Worker {
  private static instance: UnstableDevWorker;
  private constructor() {}
 
  public static async getInstance(): Promise<UnstableDevWorker> {
    
    if (!Worker.instance) {
        Worker.instance = await unstable_dev("./src/index.ts", {
          experimental: { disableExperimentalWarning: true },
        });
    }

    return Worker.instance;
  }

  public static async stop(): Promise<void> {
    if (Worker.instance) {
      await Worker.instance.stop();
    }
  }
}