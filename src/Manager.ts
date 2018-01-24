export type TIMER_OBJ = { ret: NodeJS.Timer, timeoutMillis: number, info: string }
export type INTERVAL_OBJ = { ret: NodeJS.Timer, intervalMillis: number, info: string }

class ThreadGlobalManager{
    public TIMEOUT_THREADS = new ThreadManager<TIMER_OBJ>()
    public INTERVAL_THREADS = new ThreadManager<INTERVAL_OBJ>()
    public OTHERS_THREADS = new ThreadManager<any>()

    public register<T>(obj: T){
        return this.OTHERS_THREADS.register(obj)
    }

    public forEach(f: (key: string, obj: any)=>void){
        this.TIMEOUT_THREADS.forEach(f)
        this.INTERVAL_THREADS.forEach(f)
        this.OTHERS_THREADS.forEach(f)
    }

    public clearAll(){
        this.TIMEOUT_THREADS.clearAll()
        this.INTERVAL_THREADS.clearAll()
        this.OTHERS_THREADS.clearAll()
    }

}

class ThreadManager<T>{
    public threads: { [index: string]: { obj: T, clear: ()=>void } } = {}

    public isOpen = true

    SEQ = 0
    public generateKey(){
        return `${Date.now()}.${this.SEQ ++}`
    }

    public register(obj: T){
        if (! this.isOpen) throw new Error("Not open")
        const KEY = this.generateKey()
        // console.log("register: " + KEY)
        const clear = ()=>{ delete this.threads[KEY] }
        this.threads[KEY] = { obj,  clear }
        return { KEY, clear }
    }

    public shutdown(){
        this.isOpen = false
    }

    public clearAll(){
        this.shutdown()
        for (let k in this.threads) {
            this.threads[k].clear()
        }
    }

    public forEach(func: (k: string, obj: T) => void){
        for (let k in this.threads) {
            func(k, this.threads[k].obj)
        }
    }

}

export const GLOBAL_THREAD_MANAGER = new ThreadGlobalManager()

