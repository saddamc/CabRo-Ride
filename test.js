
let savedResolve, savedReject;

const myPromise = new Promise((resolve, reject) => {
    savedResolve = resolve;
    savedReject = reject;
})

myPromise
    .then((value) => console.log("Promise Resolved: ", value))
    .catch((err)=> console.log("Promise Rejected: ", err))
    
    // savedResolve("A...............")
    
    setTimeout(() => {
    savedReject("error haiya gachi")
}, 3000)
    
    
    // .then(() =>  console.log("resolved"))
    // .catch(() => console.log("rejected"))