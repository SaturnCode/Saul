import { v4 } from "https://deno.land/std/uuid/mod.ts";

type Task = {
  id: string;
  name: string;
  data: string;
};

interface Data {
  [key: string]: any;
}

type Handler = (payload: Data) => void;

const tasks: Map<string, Task[]> = new Map<string, Task[]>();
const handlers: Map<string, Handler> = new Map<string, Handler>();
const results: Map<string, any> = new Map<string, any>();

export function cancel(taskId: string) {
  tasks.delete(taskId);
}

export function create(name: string, data: Data): Promise<string> | string {
  const task = _addOrCreateTaskArray(name, data);
  setTimeout(() => {
    if (handlers.has(name)) {
      // @ts-ignore
      _taskRunner(name, handlers.get(name));
    }
  }, 0)
  return task.id;
}

function _addOrCreateTaskArray(name: string, data: Data): Task {
  const taskId = v4.generate();
  const t: Task = {
    data: JSON.stringify(data),
    name,
    id: taskId,
  };
  if (tasks.has(name)) {
    // @ts-ignore
    tasks.get(name).push(t);
  } else {
    tasks.set(name, new Array<Task>());
    // @ts-ignore
    tasks.get(name).push(t);
  }

  return t;
}

export function handle(name: string): { with: (data: Handler) => Promise<any> | void } {
  return {
    with: function (handlerFunc: Handler): Promise<any> | void {
      _taskRunner(name, handlerFunc);
      handlers.set(name, handlerFunc);
    },
  };
}

function _taskRunner(name: string, handlerFunc: Handler) {
  if (tasks.has(name)) {
    const taskArr = tasks.get(name);
    // @ts-ignore
    taskArr.forEach(t => {
      const data = JSON.parse(t.data);
      handlerFunc(data);
    })
  }
}