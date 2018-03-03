"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./utils");
exports.utils = utils;
const Manager_1 = require("./Manager");
exports.GLOBAL_THREAD_MANAGER = Manager_1.GLOBAL_THREAD_MANAGER;
const Schedule = require("./Schedule");
exports.Schedule = Schedule;
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
