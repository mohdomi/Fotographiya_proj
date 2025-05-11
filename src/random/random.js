const pin_generator = ()=>{
    return  (
        Math.floor(Math.random() * 9000 + 1000)
    )
}

// for(let i =0 ; i<100; i++){

//     console.log(random());
// }

export default pin_generator;