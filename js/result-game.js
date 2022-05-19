import { scoring } from "./scoring";
const COUNT_NOTES = 3;
const FULL_TIME = 300;

export const resultGame = (gamers, {time,lives,answers}) => {
    if(time<=0) return `<h2 class="result__title">Alas and ah!</h2><p class="result__total result__total--fail">Time is over! You didn't have time to guess all the tunes</p>`;
    if(lives === 0) return `<h2 class="result__title">What a pity!</h2><p class="result__total result__total--fail">You have run out of all attempts. Nothing, luck next time!</p>`;
    let fastAnswers = 0;
    answers.forEach((item) => {
        if(item<30 && item>-1) fastAnswers++;
    });
    let notesOfGamer = COUNT_NOTES - lives;
    let resultOfGamer = scoring(answers,notesOfGamer)
    const results = [resultOfGamer];
    gamers.forEach((elem) => {
        let notes = 0;
        elem.answers.forEach((item) => {
            if(item === -1) notes++
        });
        results.push(scoring(elem.answers,notes))
    });    
    results.sort((left, right) => right - left);
    let position = results.lastIndexOf(resultOfGamer) + 1;
    let procentOfSuccess = Math.round(((results.length - position)/results.length)*100);
    return `<h2 class="result__title">You are a real music lover!</h2>
            <p class="result__total">In ${Math.floor((FULL_TIME-time)/60)} minutes and ${((FULL_TIME-time) % 60)} seconds, you scored ${resultOfGamer} points (${fastAnswers} quick), making ${notesOfGamer} mistakes</p>
            <p class="result__text">You finished ${position} out of ${results.length} players. Better than ${procentOfSuccess}% players</p>`
};