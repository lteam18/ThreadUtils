import { GLOBAL_THREAD_MANAGER } from "./Manager"

import { sleepInterruptibly } from "./utils"

export function inFixedRate(func: ()=>{}, intervalInMills: number){
    setInterval(()=>{
        func()
    }, intervalInMills)
}

// return interrupt function
// @return: interrupt function
export function inFixedInterval(func: ()=>void, intervalInMills: number){
    let isOn = true
    let f = ()=>{}
    (async ()=>{
        const register = GLOBAL_THREAD_MANAGER.register({ type: "schedule.inFixedInterval", intervalInMills })
        try{
            while (isOn) {
                await func()
                const { promise, clear } = sleepInterruptibly(intervalInMills)
                f = ()=> clear()
                await promise
            }
        } finally{
            register.clear()
        }
    })()
    return ()=>{
        isOn = false
        f()
    }
}
    
    