import { waitUntilInterruptibly } from "./utils";

type Runnable = () => Promise<void>
type RunnableWithThreadIndex = (threadIndex: number) => Promise<void>

export class Closable{
    
    isRunningState = true

    shutdown(){
        this.isRunningState = false
    }
    
    isShutdown(){
        return this.isRunningState
    }
}

export class ConsumerModel<JOB_TYPE> extends Closable{
    
    constructor(
        public consumer_number: number,
        public consumer_function: (job: JOB_TYPE, thread_idx: number)=>Promise<void>
    ){
        super()

        for (let thread_idx=0; thread_idx<consumer_number; ++thread_idx){
            let thread = this.createThread(thread_idx)
            this.idleConsumerQueue.push(thread)
        }
    }

    static buildThreadPool(thread_number: number){
        return new ConsumerModel(
            thread_number,
            (job: RunnableWithThreadIndex, thread_idx: number) => job(thread_idx)
        )
    }

    addJob(job: JOB_TYPE){
        if (this.isShutdown()) return false
        this.jobQueue.push(job)
        const t = this.idleConsumerQueue.shift()
        if (t !== undefined) t()
        return true
    }

    waitUntilAllDone(
        check_interval_mills: number = 100,
        maximum_waiting_mills: number = -1
    ){
        return waitUntilInterruptibly(
            ()=>this.idleConsumerQueue.length >= this.consumer_number, 
            maximum_waiting_mills,
            check_interval_mills
        )
    }

    idleConsumerQueue: Runnable[] = []
    jobQueue: JOB_TYPE[] = []

    createThread(thread_idx: number){
        const thread = async () => {
            try{
                while (! this.isShutdown()) {
                    const job = this.jobQueue.shift()
                    if (job === undefined) break
                    try{
                        await this.consumer_function(job, thread_idx)
                    } catch( err ) {
                        console.error(err)
                    }
                }
            } finally {
                this.idleConsumerQueue.push(thread)
            }
        }
        return thread
    }

}
