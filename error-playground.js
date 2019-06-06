const sum=(a,b)=>{

    if (a && b) {
        return a + b; 
    }
    
    throw new Error('Invalid Argument passed');
};

try {
    console.log(sum(1));
    console.log("After execute error123");
} catch (error) {
    console.log("There is problem in arguments");    
}

console.log("After execute error");

