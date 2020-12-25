import { assert, assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";
import { create, handle } from "./task.ts";

function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

Deno.test("It should add tasks", async () => {
  const c = await create("abcd", {
    a: 1,
    b: 2,
  });

  assert(typeof c === "string", "Should be string");
});

Deno.test("It should run tasks", async () => {
  const res: number[] = [];

  await create("doStuff", {
    val: 1,
  });

  await create("doStuff", {
    val: 2,
  });

  handle("doStuff")
    .with(async (data) => {
      await delay(1);
      res.push(Number(data.val) + 10);
    });

  await delay(100);
  // @ts-ignore
  assertEquals(res[0], 11, "First value should be 11");

  // @ts-ignore
  assertEquals(res[1], 12, "Second value should be 12");
});


Deno.test("It should run after handle is called", async () => {
  const res: number[] = [];

  handle("one")
      .with(async (data) => {
        await delay(1);
        res.push(Number(data.val) + 10);
      });

  await create("one", {
    val: 1,
  });

  await create("one", {
    val: 2,
  });


  await delay(100);
  // @ts-ignore
  assertEquals(res[0], 11, "First value should be 11");

  // @ts-ignore
  assertEquals(res[1], 12, "Second value should be 12");
});
