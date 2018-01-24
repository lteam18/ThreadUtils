import * as utils from "./utils"
export { utils }

import { GLOBAL_THREAD_MANAGER } from "./Manager"
export { GLOBAL_THREAD_MANAGER }

import * as Schedule from "./Schedule"
export { Schedule }

import * as CosumerModel from "./ConsumerModel"

// (async ()=>{

//     for (let i=0; i<3; ++i){
//         const res = utils.sleepInterruptibly(300000)
//         utils.setTimeout(()=>{
//             res.clear()
//         }, 2000)

//         utils.setTimeout(()=>{
//             console.log("TO")
//             // console.log(JSON.stringify(GLOBAL_THREAD_MANAGER.INTERVAL_THREADS.threads))
//             // console.log(JSON.stringify(GLOBAL_THREAD_MANAGER.OTHERS_THREADS.threads))
//             // console.log(JSON.stringify(GLOBAL_THREAD_MANAGER.TIMEOUT_THREADS.threads))
//             GLOBAL_THREAD_MANAGER.forEach((key)=>console.log(key))
//         }, 1000)
        
//         await res.promise
//         console.log("Hi" + i)
//     }
// })()
