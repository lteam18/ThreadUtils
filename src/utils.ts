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

// TODO: wrongly implementation
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

// return false means interruption
export function sleepInterruptibly(intervalInMillis: number): { promise: Promise<boolean>, clear: ()=>void} {
    let isEnd = false
    let clear: () => any = () => { throw new Error("Impossible to invoke") }
    const promise = new Promise<boolean>((res) => {
        const c = setTimeout(()=>{
            isEnd = true
            res(true)
        }, intervalInMillis)
        clear = () => {
            if (!isEnd) {
                isEnd = true
                res(false)
            }
            clearTimeout(c)
        }
    })
    return { promise, clear }
}

export function sleep(intervalInMillis: number) {
    return new Promise<void>((res) => setTimeout(()=>res(), intervalInMillis))
}

export function waitUntilInterruptibly(
    is_job_done: ()=>boolean,
    check_interval_mills: number,
    maximum_waiting_mills: number = -1
) {
    let clear: ()=>any = ()=>{ throw new Error("Impossible to invoke") }
    const promise = (async() => {
        const end = maximum_waiting_mills>=0 
            ? Date.now() + maximum_waiting_mills 
            : Number.MAX_SAFE_INTEGER
        while (! is_job_done()){
            if (Date.now() > end) return false
            const {promise, clear: _clear} = sleepInterruptibly(check_interval_mills)
            clear = ()=>_clear()
            if (false === await promise) return false
        }
        return true
    })()
    return { promise, clear: () => clear() }
}

