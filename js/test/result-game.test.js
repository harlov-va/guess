import {assert} from 'chai';
import {resultGame} from '../game/result-game';

// const attemptsEnded = {
//     time:200,
//     notes: 0
// };

// const runOutOfTime = {
//     time:600
// };
// const getRandomInt = (min, max) => {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }
// const createRandomArray = () => {
//     const arr = [];
//     for(let i = 0; i<getRandomInt(1,20); i++){
//         arr.push(getRandomInt(4,20));
//     }
//     return arr;
// };
// const totalSecond = {
//     result: 4,
//     time: 200,
//     attempt: 3
// };
// const totalThird = {
//     result: 20,
//     time: 200,
//     attempt: 3
// };
// const totalFourth = {
//     result: 20,
//     time: 400,
//     attempt: 3
// };
// const totalFifth = {
//     result: 20,
//     time: 200,
//     attempt: 0
// };
const arrayResults = [
    {
        answers: [
            34,
            40,
            11,
            20,
            -1,
            20,
            -1,
            10,
            2,
            10
        ]        
    },
    {
        "answers": [
            20,
            20,
            -1,
            20,
            12,
            20,
            15,
            10,
            2,
            10
        ]        
    },
    {
        "answers": [
            10,
            10,
            11,
            20,
            12,
            20,
            15,
            10,
            2,
            10
        ]       
    },
];
const totalFirst = {
    "level": 9,
    "lives": 1,
    "time": 160,
    answers: [
        34,
        40,
        11,
        20,
        -1,
        20,
        -1,
        10,
        2,
        10
    ] 
};
describe(`Вывод результата игры`, () => {
    it(`Вывод выигрыша`, () => {
        //Вывод строки вида: Вы заняли i место из t игроков. Это лучше, чем у n% игроков
        assert.equal(resultGame(arrayResults,totalFirst),`Вы заняли 3 место из 7 игроков. Это лучше, чем у 57% игроков`);
        assert.equal(resultGame(arrayResults,totalFirst),`Вы заняли 7 место из 7 игроков. Это лучше, чем у 0% игроков`);
        assert.equal(resultGame(arrayResults,totalFirst),`Вы заняли 1 место из 7 игроков. Это лучше, чем у 86% игроков`);
    });
    // it(`Проигрыш по времени`, () => {
    //     //Вывод проигрыша если закончилось время
    //     assert.equal(resultGame(arrayResults,totalFirst),`<h2 class="result__title">Увы и ах!</h2><p class="result__total result__total--fail">Время вышло! Вы не успели отгадать все мелодии</p>`);
    // });    
    // it(`Проигрыш по попыткам`,() => {
    //     //Вывод проигрыша если закончились попытки
    //     assert.equal(resultGame(arrayResults,totalFirst),`<h2 class="result__title">Какая жалость!</h2><p class="result__total result__total--fail">У вас закончились все попытки. Ничего, повезёт в следующий раз!</p>`);
    // });
});