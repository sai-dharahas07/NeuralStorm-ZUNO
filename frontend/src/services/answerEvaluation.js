const normalize = value => String(value ?? "").trim().toLowerCase().replace(/[×]/g,"*").replace(/[÷]/g,"/").replace(/[−]/g,"-").replace(/\\s+/g," ");
export async function evaluateAnswer({question,answer,expectedAnswer,maxMarks=1,rubric=""}) {
 const endpoint=import.meta.env.VITE_AI_EVALUATION_ENDPOINT;
 if(endpoint){try{const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question,answer,expectedAnswer,maxMarks,rubric})});if(r.ok){const v=await r.json();if(Number.isFinite(Number(v.score)))return {score:Math.max(0,Math.min(Number(maxMarks),Number(v.score))),maxMarks:Number(maxMarks),feedback:String(v.feedback||"Evaluated by connected AI service."),evaluator:"AI service"};}}catch(e){console.warn("AI endpoint unavailable; using local marking.",e);}}
 const a=normalize(answer), expected=normalize(expectedAnswer), marks=Math.max(1,Number(maxMarks)||1);
 if(!a)return {score:0,maxMarks:marks,feedback:"No answer was submitted.",evaluator:"Local rule-based evaluator"};
 if(a===expected || (Number.isFinite(Number(a))&&Number.isFinite(Number(expected))&&Number(a)===Number(expected)))return {score:marks,maxMarks:marks,feedback:"Correct. The answer matches the expected result.",evaluator:"Local rule-based evaluator"};
 const terms=normalize(rubric).split(/[^a-z0-9]+/).filter(x=>x.length>2), response=new Set(a.split(/[^a-z0-9]+/).filter(x=>x.length>2)), matched=terms.filter(x=>response.has(x));
 if(terms.length&&matched.length){const score=Math.round(marks*matched.length/terms.length*100)/100;return {score,maxMarks:marks,feedback:`Partially matched the marking guide (${matched.length} of ${terms.length} key terms). Teacher review is recommended.`,evaluator:"Local rubric matcher"};}
 return {score:0,maxMarks:marks,feedback:`Not an exact match. Expected answer: ${expectedAnswer}. The teacher can review this response.`,evaluator:"Local rule-based evaluator"};
}
