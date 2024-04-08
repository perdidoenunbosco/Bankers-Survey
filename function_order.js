

function doFirst(){

return new Promise((resolve, reject) => {
    
    setTimeout(() => {
    
        const dogWalked = true;

    if(dogWalked){
        resolve ("The first resolved");
                }
    else{
        reject("the first rejected");
        }
    },6000);

console.log("N - doFirst-> After setTimeout");

});

}; // END doFirst

function doSecond(){

    return new Promise((resolve, reject) => {
    
        setTimeout(() => {
        
            const dogWalked = true;

        if(dogWalked){
            resolve ("The Second Resolved");
                    }
        else{   
            reject("Do Second Rejected");
            }
        },3000);
    
    console.log("N - doSecond-> After setTimeout");
    
    });
}; // END doSecond

async function doChores(){

const doFirstThing = await doFirst();
console.log(doFirstThing);

const doSecondThing = await doSecond();
console.log(doSecondThing);

}// END doChores

doChores();
