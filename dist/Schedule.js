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
const Manager_1 = require("./Manager");
const utils_1 = require("./utils");
function inFixedRate(func, intervalInMills) {
    setInterval(() => {
        func();
    }, intervalInMills);
}
exports.inFixedRate = inFixedRate;
// return interrupt function
// @return: interrupt function
function inFixedInterval(func, intervalInMills) {
    let isOn = true;
    let f = () => { };
    (() => __awaiter(this, void 0, void 0, function* () {
        const register = Manager_1.GLOBAL_THREAD_MANAGER.register({ type: "schedule.inFixedInterval", intervalInMills });
        try {
            while (isOn) {
                yield func();
                const { promise, clear } = utils_1.sleepInterruptibly(intervalInMills);
                f = () => clear();
                yield promise;
            }
        }
        finally {
            register.clear();
        }
    }))();
    return () => {
        isOn = false;
        f();
    };
}
exports.inFixedInterval = inFixedInterval;
