import { setTimeout as st, setInterval as si, clearTimeout } from "timers";

import { GLOBAL_THREAD_MANAGER } from "./Manager"

export function setTimeout(func: ()=>void, timeoutMillis: number, info="") {
    let c = ()=>{}
    const ret = st(()=>{
        func()
        c()
    }, timeoutMillis)
    const o = GLOBAL_THREAD_MANAGER.TIMEOUT_THREADS.register({ ret, timeoutMillis, info })
    c = () => o.clear()
    return ret
}

export function setInterval(func: ()=>void, intervalMillis: number, info="") {
    let c = ()=>{}
    const ret = si(()=>{
        func()
        c()
    }, intervalMillis)
    const o = GLOBAL_THREAD_MANAGER.INTERVAL_THREADS.register({ ret, intervalMillis, info })
    c = () => o.clear()
    return ret
}


export function sleepInterruptibly(intervalInMillis: number): { promise: Promise<void>, clear: ()=>void} {
    let isEnd = false
    let clear = () => {}
    const promise = new Promise<void>((res) => {
        const c = setTimeout(()=>{
            isEnd = true
            res()
        }, intervalInMillis)
        clear = () => {
            if (!isEnd) {
                isEnd = true
                res()
            }
            clearTimeout(c)
        }
    })
    return { promise, clear }
}

export function sleep(intervalInMillis: number) {
    return new Promise<void>((res) => setTimeout(()=>res(), intervalInMillis))
}

