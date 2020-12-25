import {connect, RedisConnectOptions} from "https://deno.land/x/redis/mod.ts";
import {Task} from "../tasks/task.ts";

let redis: any;
let pub :any;
let sub:any

export const initRedis = async (options:RedisConnectOptions) => {
    redis = await connect(options);
    pub = await connect(options);
    sub = await connect(options);
}

export const subscribe = async (channel: string) => {
    const subscribe = await sub.subscribe(channel);
    await (async function () {
        for await (const {channel, message} of subscribe.receive()) {
            console.log({channel, message:message})
        }
    })();
}

const publish = async (channel: string, data:any) => {
    console.log("publish ", data)
    return pub.publish(channel, JSON.stringify(data));
}

export const addTaskToRedis = async (task:Task)=>{
    return publish(task.name, task)
}



