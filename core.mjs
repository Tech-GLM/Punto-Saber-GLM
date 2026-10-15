export const AREAS = [
 {id:'matematicas',name:'Matemáticas',short:'Matemáticas',icon:'math',color:'#4973cc',light:'#eaf0ff',description:'Razona, conecta y resuelve.',topics:'Conteo · Geometría · Variación'},
 {id:'lectura',name:'Lectura y lenguaje',short:'Lectura',icon:'book',color:'#bc7750',light:'#fbefe7',description:'Lee más allá de las palabras.',topics:'Interpretación · Sentido · Inferencia'},
 {id:'ciencias',name:'Ciencias naturales',short:'Ciencias',icon:'flask',color:'#408574',light:'#e8f4ef',description:'Pregunta, observa, comprende.',topics:'Biología · Química · Física'},
 {id:'sociales',name:'Sociales e historia',short:'Sociales',icon:'globe',color:'#9270ae',light:'#f1eafb',description:'Entiende el mundo y sus cambios.',topics:'Historia · Sociedad · Economía'},
 {id:'ingles',name:'Inglés',short:'Inglés',icon:'language',color:'#bf8150',light:'#fff2df',description:'Build your confidence, step by step.',topics:'Reading · Grammar · Communication'}
];
export const LETTERS=['A','B','C','D'];
export const normalize=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function shuffled(items,random=Math.random){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
export function selectQuestions(questions,{area='all',count=10,ids=null,random=Math.random}={}){
 const list=questions.filter(q=>(area==='all'||q.area===area)&&(!ids||ids.includes(q.id)));
 if(area!=='all')return shuffled(list,random).slice(0,count);
 const groups=AREAS.map(a=>shuffled(list.filter(q=>q.area===a.id),random));
 const selected=[];
 while(selected.length<Math.min(count,list.length))for(const g of groups)if(g.length&&selected.length<count)selected.push(g.pop());
 return shuffled(selected,random);
}
export const isCorrect=(q,answer)=>q.answers.includes(answer);
export function evaluate(questions,answers){
 const byArea=Object.fromEntries(AREAS.map(a=>[a.id,{total:0,correct:0,answered:0}]));
 let correct=0,answered=0;
 for(const q of questions){let a=answers[q.id];byArea[q.area].total++;if(LETTERS.includes(a)){answered++;byArea[q.area].answered++;if(isCorrect(q,a)){correct++;byArea[q.area].correct++;}}}
 return {total:questions.length,answered,correct,incorrect:answered-correct,omitted:questions.length-answered,percentage:questions.length?Math.round(100*correct/questions.length):0,byArea};
}
export function remainingSeconds(session,now=Date.now()){return session.mode==='exam'?Math.max(0,Math.ceil((session.deadline-now)/1000)):null;}
export function formatTime(seconds){seconds=Math.max(0,Math.floor(seconds));return `${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;}
export function questionStatus(q,progress){const attempts=progress.attempts?.[q.id]||[];if(!attempts.length)return 'new';return attempts.at(-1).correct?'correct':'review';}
