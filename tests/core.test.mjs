import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {AREAS,selectQuestions,evaluate,remainingSeconds,formatTime,normalize,isCorrect,questionStatus} from '../core.mjs';
const bank=JSON.parse(fs.readFileSync(new URL('../bank.json',import.meta.url)));
const qs=bank.questions;
test('bank has 60 distinct source-backed questions and 106 original PDFs',()=>{
 assert.equal(qs.length,60);assert.equal(new Set(qs.map(q=>q.id)).size,60);assert.equal(bank.catalog.length,106);
 for(const q of qs){assert.equal(q.options.length,4);assert(q.explanation.length>50);assert(AREAS.some(a=>a.id===q.area));for(const a of q.answers)assert.match(a,/^[ABCD]$/);assert(fs.existsSync(new URL('../'+q.source,import.meta.url)));assert(fs.existsSync(new URL('../'+q.answerSource,import.meta.url)));if(q.image)assert(fs.existsSync(new URL('../'+q.image.url,import.meta.url)));}
 assert(!qs.some(q=>q.number===16&&q.discipline==='Matemáticas'));
 for(const p of bank.catalog)assert(fs.existsSync(new URL('../'+p.url,import.meta.url)));
});
test('mixed sessions balance the five areas, avoid duplicate questions, and do not mutate the bank',()=>{
 const before=qs.map(q=>q.id);for(const n of [1,5,10,20,40,60,80]){const chosen=selectQuestions(qs,{count:n});assert.equal(chosen.length,Math.min(n,60));assert.equal(new Set(chosen.map(q=>q.id)).size,chosen.length);if(n>=5)for(const a of AREAS)assert(chosen.some(q=>q.area===a.id));}
 assert.deepEqual(qs.map(q=>q.id),before);
});
test('area, filtered subset, and small collections never pull unrelated questions',()=>{
 const ten=selectQuestions(qs,{area:'ingles',count:20});assert.equal(ten.length,10);assert(ten.every(q=>q.area==='ingles'));
 const ids=qs.slice(5,8).map(q=>q.id);const selected=selectQuestions(qs,{ids,count:10});assert.equal(selected.length,3);assert(selected.every(q=>ids.includes(q.id)));
 assert.deepEqual(selectQuestions(qs,{ids:[],count:10}),[]);
});
test('both historical valid alternatives are accepted, and invalid options are rejected',()=>{
 for(const n of [21,22,23,24]){const q=qs.find(q=>q.number===n);assert.equal(q.answers.length,2);for(const a of q.answers)assert(isCorrect(q,a));for(const a of ['A','B','C','D'].filter(a=>!q.answers.includes(a)))assert(!isCorrect(q,a));}
});
test('score uses all questions as denominator, including omissions',()=>{
 const sample=qs.slice(0,4);const answers={[sample[0].id]:sample[0].answers[0],[sample[1].id]:['A','B','C','D'].find(a=>!sample[1].answers.includes(a)),[sample[2].id]:sample[2].answers[0]};
 const result=evaluate(sample,answers);assert.deepEqual([result.total,result.answered,result.correct,result.incorrect,result.omitted,result.percentage],[4,3,2,1,1,50]);assert.equal(Object.values(result.byArea).reduce((a,b)=>a+b.total,0),4);
 assert.equal(evaluate([],{}).percentage,0);
});
test('timer uses an absolute deadline and cannot be reset by reloading serialized state',()=>{
 const session={mode:'exam',startedAt:0,deadline:120000};assert.equal(remainingSeconds(session,0),120);assert.equal(remainingSeconds(session,60001),60);assert.equal(remainingSeconds(JSON.parse(JSON.stringify(session)),90000),30);assert.equal(remainingSeconds(session,180000),0);assert.equal(remainingSeconds({mode:'learn'},500),null);assert.equal(formatTime(125),'02:05');assert.equal(formatTime(-1),'00:00');
});
test('latest attempt determines review status; normalized search handles accents',()=>{
 const q=qs[0];assert.equal(questionStatus(q,{attempts:{}}),'new');assert.equal(questionStatus(q,{attempts:{[q.id]:[{correct:true},{correct:false}]}}),'review');assert.equal(questionStatus(q,{attempts:{[q.id]:[{correct:false},{correct:true}]}}),'correct');assert.equal(normalize('Matemáticas, QUÍMICA'),'matematicas, quimica');
});
