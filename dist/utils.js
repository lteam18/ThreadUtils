"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const timers_1 = require("timers");
const Manager_1 = require("./Manager");
function setTimeout(func, timeoutMillis, info = "") {
    let c = () => { };
    const ret = timers_1.setTimeout(() => {
        func();
        c();
    }, timeoutMillis);
    const o = Manager_1.GLOBAL_THREAD_MANAGER.TIMEOUT_THREADS.register({ ret, timeoutMillis, info });
    c = () => o.clear();
    return ret;
}
exports.setTimeout = setTimeout;
// TODO: wrongly implementation
function setInterval(func, intervalMillis, info = "") {
    let c = () => { };
    const ret = timers_1.setInterval(() => {
        func();
        c();
    }, intervalMillis);
    const o = Manager_1.GLOBAL_THREAD_MANAGER.INTERVAL_THREADS.register({ ret, intervalMillis, info });
    c = () => o.clear();
    return ret;
}
exports.setInterval = setInterval;
// return false means interruption
function sleepInterruptibly(intervalInMillis) {
    let isEnd = false;
    let clear = () => { throw new Error("Impossible to invoke"); };
    const promise = new Promise((res) => {
        const c = setTimeout(() => {
            isEnd = true;
            res(true);
        }, intervalInMillis);
        clear = () => {
            if (!isEnd) {
                isEnd = true;
                res(false);
            }
            timers_1.clearTimeout(c);
        };
    });
    return { promise, clear };
}
exports.sleepInterruptibly = sleepInterruptibly;
function sleep(intervalInMillis) {
    return new Promise((res) => setTimeout(() => res(), intervalInMillis));
}
exports.sleep = sleep;
function waitUntilInterruptibly(is_job_done, check_interval_mills, maximum_waiting_mills = -1) {
    let clear = () => { throw new Error("Impossible to invoke"); };
    const promise = (() => __awaiter(this, void 0, void 0, function* () {
        const end = maximum_waiting_mills >= 0
            ? Date.now() + maximum_waiting_mills
            : Number.MAX_SAFE_INTEGER;
        while (!is_job_done()) {
            if (Date.now() > end)
                return false;
            const { promise, clear: _clear } = sleepInterruptibly(check_interval_mills);
            clear = () => _clear();
            if (false === (yield promise))
                return false;
        }
        return true;
    }))();
    return { promise, clear: () => clear() };
}
exports.waitUntilInterruptibly = waitUntilInterruptibly;
