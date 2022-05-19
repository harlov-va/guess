export const adapterSeverData = (data) => {
    for(let level of data){
        for(let answer of level.answers){
            answer.src = `https://guessmelody.anatoly-dolgov.ru/`+answer.src;
            answer.image = `https://guessmelody.anatoly-dolgov.ru/`+answer.image;
        }
    }
    return data;
}