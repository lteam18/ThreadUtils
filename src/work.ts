import { sleep } from "./utils"


sleep(3000).then(()=>{
    console.log("123")
    sleep(500).then(()=>{
        console.log("128")
    })
})

async function work(){
    await sleep(3000)
    console.log("123")
    await sleep(5000)
    console.log("128")
}


const a = new Promise<Number>((resolve, reject) => {
    setTimeout(()=>{
        resolve(3)
    }, 1000)
})

a.then(()=>{
    console.log("Finished")
    a.then(()=>{
        console.log("Finished")
    })
})

async function f(){
    const c = await a
    await a
}