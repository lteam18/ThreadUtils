import { GLOBAL_THREAD_MANAGER } from "./Manager"

import { sleepInterruptibly } from "./utils"

export function inFixedRate(func: ()=>{}, intervalInMills: number){

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
                func()
                const c = sleepInterruptibly(intervalInMills)
                f = ()=> c.clear()
                await c.promise
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
    
    