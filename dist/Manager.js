"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ThreadGlobalManager {
    constructor() {
        this.TIMEOUT_THREADS = new ThreadManager();
        this.INTERVAL_THREADS = new ThreadManager();
        this.OTHERS_THREADS = new ThreadManager();
    }
    register(obj) {
        return this.OTHERS_THREADS.register(obj);
    }
    forEach(f) {
        this.TIMEOUT_THREADS.forEach(f);
        this.INTERVAL_THREADS.forEach(f);
        this.OTHERS_THREADS.forEach(f);
    }
    clearAll() {
        this.TIMEOUT_THREADS.clearAll();
        this.INTERVAL_THREADS.clearAll();
        this.OTHERS_THREADS.clearAll();
    }
}
class ThreadManager {
    constructor() {
        this.threads = {};
        this.isOpen = true;
        this.SEQ = 0;
    }
    generateKey() {
        return `${Date.now()}.${this.SEQ++}`;
    }
    register(obj) {
        if (!this.isOpen)
            throw new Error("Not open");
        const KEY = this.generateKey();
        console.log("register: " + KEY);
        const clear = () => { console.log("clear invoke"); delete this.threads[KEY]; };
        this.threads[KEY] = { obj, clear };
        return { KEY, clear };
    }
    shutdown() {
        this.isOpen = false;
    }
    clearAll() {
        this.shutdown();
        for (let k in this.threads) {
            this.threads[k].clear();
        }
    }
    forEach(func) {
        for (let k in this.threads) {
            func(k, this.threads[k].obj);
        }
    }
}
exports.GLOBAL_THREAD_MANAGER = new ThreadGlobalManager();
