import {
    beforeAll,
} from "https://x.nest.land/hooked@0.1.0/mod.ts";
import {assertEquals} from "https://deno.land/std@0.74.0/testing/asserts.ts";

import {initRedis} from "./redis.ts";

beforeAll(async () => {
    await initRedis({
        hostname: 'localhost',
        port: '6379',
    })
});

Deno.test("should pub/sub works", async () => {
    //TODO I couldn't write test case for pub-sub
});