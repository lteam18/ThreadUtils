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
const utils_1 = require("./utils");
class Closable {
    constructor() {
        this.isRunningState = true;
    }
    shutdown() {
        this.isRunningState = false;
    }
    isShutdown() {
        return this.isRunningState;
    }
}
exports.Closable = Closable;
class ConsumerModel extends Closable {
    constructor(consumer_number, consumer_function) {
        super();
        this.consumer_number = consumer_number;
        this.consumer_function = consumer_function;
        this.idleConsumerQueue = [];
        this.jobQueue = [];
        for (let thread_idx = 0; thread_idx < consumer_number; ++thread_idx) {
            let thread = this.createThread(thread_idx);
            this.idleConsumerQueue.push(thread);
        }
    }
    static buildThreadPool(thread_number) {
        return new ConsumerModel(thread_number, (job, thread_idx) => job(thread_idx));
    }
    addJob(job) {
        if (this.isShutdown())
            return false;
        this.jobQueue.push(job);
        const t = this.idleConsumerQueue.shift();
        if (t !== undefined)
            t();
        return true;
    }
    waitUntilAllDone(check_interval_mills = 100, maximum_waiting_mills = -1) {
        return utils_1.waitUntilInterruptibly(() => this.idleConsumerQueue.length >= this.consumer_number, maximum_waiting_mills, check_interval_mills);
    }
    createThread(thread_idx) {
        const thread = () => __awaiter(this, void 0, void 0, function* () {
            try {
                while (!this.isShutdown()) {
                    const job = this.jobQueue.shift();
                    if (job === undefined)
                        break;
                    try {
                        yield this.consumer_function(job, thread_idx);
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            }
            finally {
                this.idleConsumerQueue.push(thread);
            }
        });
        return thread;
    }
}
exports.ConsumerModel = ConsumerModel;
