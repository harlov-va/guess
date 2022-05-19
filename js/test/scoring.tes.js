import {assert} from 'chai';
import {scoring} from '../scoring';
const COUNT_QUESTIONS = 10;
const DEFAULT_TIME = 60;

const createAnswers = (count = 0, timeAnswer = DEFAULT_TIME) => {
    const arr = [];
    for(let i=0; i<COUNT_QUESTIONS; i++){
        arr.push({
            right:count-i>0 ? true : false,
            time: (count/2-i)>0 ? timeAnswer : DEFAULT_TIME
        });
    };
    return arr;
};

describe(`Scoring`, () => {
    it(`меньше, чем на 10 вопросов, возвращает -1`, () => {
        //сформировать массив для передачи в функцию scoring
        const answersArr = createAnswers();
        const notes = 0;
        //теперь всё засовываем в чай и проверяем
        assert.equal(scoring(answersArr, notes), -1);
    });
    it(`ответил на вопросы, но с ошибками`, () => {
        assert.equal(scoring(createAnswers(10),3),10);
        //но меньшее количество жизней
        assert.equal(scoring(createAnswers(9),2),7);
        assert.equal(scoring(createAnswers(8),1),4);
        assert.equal(scoring(createAnswers(7),0),-1);
        //разные вариации правильных ответов
        assert.equal(scoring(createAnswers(0),0),-1);
        assert.equal(scoring(createAnswers(8),1),4);
        assert.equal(scoring(createAnswers(9),2),7);
    });
    //ответил правильно, но на некоторые вопросы меньше чем за 30 сек
    it(`ответил на некоторые вопросы быстро`,() => {
        assert.equal(scoring(createAnswers(10,20),3),20);
        assert.equal(scoring(createAnswers(9,40),2),7);
        assert.equal(scoring(createAnswers(9,30),2),7);
        assert.equal(scoring(createAnswers(9,20),2),17);
        assert.equal(scoring(createAnswers(8,40),1),4);
        assert.equal(scoring(createAnswers(8,30),1),4);
        assert.equal(scoring(createAnswers(8,20),1),12);
    });
});