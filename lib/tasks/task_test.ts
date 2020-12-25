import { assert } from "https://deno.land/std@0.74.0/testing/asserts.ts";
import {create} from "./task.ts"

Deno.test("It should add tasks", async () => {
    const c = await create("abcd", {
        a: 1,
        b: 2
    })

    assert(typeof c === "string", "Should be string")
})