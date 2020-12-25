import { v4 } from "https://deno.land/std/uuid/mod.ts";

type Task = {
  id: string;
  name: string;
  data: string;
};

interface Data {
  [key: string]: any;
}

type DoneCallback = (_: any) => void;
// type Handler = (payload: Data, cb: DoneCallback) => void
type Handler = (payload: Data) => void;

const state: Map<string, Task[]> = new Map<string, Task[]>();

export function cancel(taskId: string) {
  state.delete(taskId);
}

export function create(name: string, data: Data): Promise<string> | string {
  const task = _addOrCreateTaskArray(name, data);
  return task.id;
}

function _addOrCreateTaskArray(name: string, data: Data): Task {
  const taskId = v4.generate();
  const t: Task = {
    data: JSON.stringify(data),
    name,
    id: taskId,
  };
  if (state.has(name)) {
    // @ts-ignore
    state.get(name).push(t);
  } else {
    state.set(name, new Array<Task>());
    // @ts-ignore
    state.get(name).push(t);
  }

  return t;
}

export function handle(
  name: string,
  handlerFunc?: Handler,
): { with: (_: Handler) => void } {
  return {
    with: function (handlerFunc: Handler): void {
      let current: Task;
      if (state.has(name)) {
        const taskArr = state.get(name);
        // @ts-ignore
        for (let i = 0; i < taskArr.length; i++) {
          // @ts-ignore
          current = taskArr[i];
          const data = JSON.parse(current.data);
          handlerFunc(data);
        }
      }
    },
  };
}
