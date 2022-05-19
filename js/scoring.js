export const scoring = (answers, notes) => {
    if(notes === 3 ) return false;
    let countRight = 0;
    let countTime = 0;
    answers.forEach((elem) => {
        if(elem > 0) {
            countRight++;
            if(elem <30) countTime ++;
        }
    });    
    return countRight + (countTime*2) - (notes)*2;
}