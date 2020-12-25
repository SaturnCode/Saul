import { v4 } from "https://deno.land/std/uuid/mod.ts";

type Task = {
  id: string
  name: string
  data: string
}

const state: Map<string, Task[]> = new Map<string, Task[]>()

export function cancel(taskId: string) {
  state.delete(taskId)
}

export function create(name: string, data: object): Promise<string> | string {
  const task = _addOrCreateTaskArray(name, data);
  return task.id;
}


function _addOrCreateTaskArray(name: string, data: object): Task {
  const taskId = v4.generate();
  const t: Task = {
    data: JSON.stringify(data),
    name,
    id: taskId
  }
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