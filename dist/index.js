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
const utils = require("./utils");
exports.utils = utils;
const Manager_1 = require("./Manager");
exports.GLOBAL_THREAD_MANAGER = Manager_1.GLOBAL_THREAD_MANAGER;
const Schedule = require("./Schedule");
exports.Schedule = Schedule;
(() => __awaiter(this, void 0, void 0, function* () {
    for (let i = 0; i < 3; ++i) {
        const res = utils.sleepInterruptibly(300000);
        utils.setTimeout(() => {
            res.clear();
        }, 2000);
        utils.setTimeout(() => {
            console.log("TO");
            // console.log(JSON.stringify(GLOBAL_THREAD_MANAGER.INTERVAL_THREADS.threads))
            // console.log(JSON.stringify(GLOBAL_THREAD_MANAGER.OTHERS_THREADS.threads))
            // console.log(JSON.stringify(GLOBAL_THREAD_MANAGER.TIMEOUT_THREADS.threads))
            Manager_1.GLOBAL_THREAD_MANAGER.forEach((key) => console.log(key));
        }, 1000);
        yield res.promise;
        console.log("Hi" + i);
    }
}))();
