
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PracticeQuiz.css";
import { evaluateAnswer } from "../services/answerEvaluation";
import { saveQuizAttempt } from "../services/backendApi";

const BASE_QUESTIONS = [
 {question:"What is 6 + 4?",options:["8","9","10","11"],answer:"10",explanation:"6 + 4 = 10. Count four numbers after six."},
 {question:"What is 9 - 3?",options:["5","6","7","8"],answer:"6",explanation:"When you take 3 away from 9, you have 6 left."},
 {question:"What is 3 × 4?",options:["7","10","12","16"],answer:"12",explanation:"3 × 4 means 4 + 4 + 4 = 12."},
 {question:"What is 20 ÷ 5?",options:["2","3","4","5"],answer:"4",explanation:"20 divided into 5 equal groups gives 4 in each group."},
 {question:"What is 15 + 5?",options:["15","18","20","25"],answer:"20",explanation:"15 + 5 = 20."}
];
export default function PracticeQuiz(){
 const navigate=useNavigate();
 const [teacherTests]=useState(()=>{try{return JSON.parse(localStorage.getItem("zuno_custom_tests")||"[]")}catch{return []}});
 const [selectedTestId,setSelectedTestId]=useState(teacherTests[0]?.id??"");
 const activeTest=teacherTests.find(x=>String(x.id)===String(selectedTestId));
 const questions=activeTest?.questions?.length?activeTest.questions:BASE_QUESTIONS;
 const [current,setCurrent]=useState(0),[selected,setSelected]=useState(""),[written,setWritten]=useState("");
 const [feedback,setFeedback]=useState(false),[evaluation,setEvaluation]=useState(null),[score,setScore]=useState(0),[earned,setEarned]=useState(0),[finished,setFinished]=useState(false),[saveStatus,setSaveStatus]=useState("idle");
 const question=questions[current],teacherMode=Boolean(activeTest),maxMarks=questions.reduce((n,q)=>n+(Number(q.marks)||1),0);
 useEffect(()=>{if(finished){const total=teacherMode?maxMarks:questions.length;const value=teacherMode?earned:score;localStorage.setItem("neuralstorm_practice_result",JSON.stringify({score:value,total,percentage:Math.round(value/total*100)}));}},[finished,score,earned,questions.length,maxMarks,teacherMode]);
 async function check(){
  const response=teacherMode?written:selected;if(!String(response).trim())return;
  if(teacherMode){const result=await evaluateAnswer({question:question.question,answer:response,expectedAnswer:question.answer,maxMarks:question.marks||1,rubric:question.rubric||""});setEvaluation(result);setEarned(v=>v+result.score);if(result.score>=(Number(question.marks)||1))setScore(v=>v+1);}
  else if(selected===question.answer)setScore(v=>v+1);
  setFeedback(true);
 }
 async function next(){
  if(current<questions.length-1){setCurrent(v=>v+1);setSelected("");setWritten("");setEvaluation(null);setFeedback(false);}
  else {
   const total=teacherMode?maxMarks:questions.length,value=teacherMode?earned:score;
   setFinished(true);
   setSaveStatus("saving");
   const percentage = Math.round((value / total) * 100);
   const preferences = (() => { try { return JSON.parse(localStorage.getItem("neuralstorm_learning_preferences") || "{}"); } catch { return {}; } })();
   try {
     await saveQuizAttempt({
       quiz_id: teacherMode ? `teacher-test-${activeTest.id}` : "practice-maths-v1",
       score: percentage,
       total_questions: questions.length,
       correct_answers: Math.min(questions.length, Math.max(0, Math.round((value / total) * questions.length))),
       difficulty_level: preferences.difficulty || "beginner",
       answers: [],
     });
     setSaveStatus("saved");
   } catch {
     setSaveStatus("failed");
   }
   if(teacherMode){let previous=[];try{previous=JSON.parse(localStorage.getItem("zuno_test_submissions")||"[]")}catch { /* Ignore malformed local submissions. */ }localStorage.setItem("zuno_test_submissions",JSON.stringify([{testId:activeTest.id,testTitle:activeTest.title,student:"Current browser learner",score:value,totalMarks:total,evaluator:evaluation?.evaluator||"Local rule-based evaluator",submittedAt:new Date().toISOString()},...previous]));}
  }
 }
 function restart(){setCurrent(0);setSelected("");setWritten("");setEvaluation(null);setFeedback(false);setScore(0);setEarned(0);setFinished(false);setSaveStatus("idle");}
 if(finished){const total=teacherMode?maxMarks:questions.length,value=teacherMode?earned:score,percent=Math.round(value/total*100);return <div className="practice-page"><main className="practice-result"><p className="practice-label">TEST COMPLETED</p><h1>Well done!</h1><p>You completed {activeTest?.title||"your practice quiz"}.</p><p role="status" aria-live="polite">{saveStatus==="saving"?"Saving your result…":saveStatus==="saved"?"Your result has been saved to the backend.":saveStatus==="failed"?"Your result is stored on this device, but the backend could not be reached.":""}</p><div className="practice-score"><strong>{value}/{total}</strong><span>{percent}% awarded</span></div><button className="practice-primary" onClick={restart}>Try Again</button><button className="practice-secondary" onClick={()=>navigate("/dashboard")}>Go to Dashboard</button></main></div>}
 return <div className="practice-page">
  {teacherTests.length>0&&<label className="teacher-test-select">Teacher-created test<select value={selectedTestId} onChange={e=>{setSelectedTestId(e.target.value);restart();}}>{teacherTests.map(test=><option key={test.id} value={test.id}>{test.title}</option>)}</select></label>}
  <header className="practice-header"><button className="practice-back" onClick={()=>navigate("/dashboard")}>← Dashboard</button><span>{teacherMode?"Teacher Test":"Practice Zone"}</span></header>
  <main className="practice-main"><section className="practice-intro"><p className="practice-label">LEARN BY PRACTICING</p><h1>{teacherMode?activeTest.title:"Let's Practice!"}</h1><p>Take your time. You can do this!</p></section>
   <section className="practice-card"><div className="practice-question-header"><span>Question {current+1} of {questions.length}</span><span>{teacherMode?`Marks: ${earned}/${maxMarks}`:`Score: ${score}`}</span></div>
    <div className="practice-progress-track" role="progressbar" aria-label="Quiz progress" aria-valuenow={current+1} aria-valuemin={1} aria-valuemax={questions.length}><div className="practice-progress-fill" style={{width:`${(current+1)/questions.length*100}%`}}/></div>
    <h2 className="practice-question">{question.question}</h2>
    {teacherMode?<label className="teacher-answer-field">Your answer<textarea rows="4" value={written} onChange={e=>setWritten(e.target.value)} disabled={feedback} placeholder="Write your answer in your own words"/></label>:<div className="practice-options">{(question.options||[]).map(option=><button key={option} className={`practice-option ${selected===option?"selected":""} ${feedback&&option===question.answer?"correct":""}`} onClick={()=>setSelected(option)} disabled={feedback}>{option}</button>)}</div>}
    {feedback&&<div className="practice-feedback" role="status"><h3>{teacherMode?(evaluation?.score>0?"Answer reviewed":"Needs teacher review"):(selected===question.answer?"Correct":"Not quite")}</h3><p>{question.explanation||""}</p>{evaluation&&<p><b>Score: {evaluation.score}/{evaluation.maxMarks}.</b> {evaluation.feedback} <small>Marked by: {evaluation.evaluator}</small></p>}{!teacherMode&&selected!==question.answer&&<p>Correct answer: {question.answer}</p>}</div>}
    {!feedback?<button className="practice-primary" onClick={check} disabled={teacherMode?!written.trim():!selected}>Check Answer</button>:<button className="practice-primary" onClick={next}>{current+1===questions.length?"View Results":"Next Question →"}</button>}
   </section><p className="practice-support">Mistakes are part of learning. Keep going at your own pace.</p>
  </main>
 </div>;
}
