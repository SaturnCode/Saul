import {assert} from 'https://deno.land/std@0.74.0/testing/asserts.ts'
import {run} from "./runner.ts";

Deno.test("Should run the run function", async () => {
    const add = (a: number[]) => a.reduce((acc, v) => acc + v, 0)

    assert(
        run<number[], number>(add, [1, 2, 4]) === 7,
        'Should show 7'
    )
})