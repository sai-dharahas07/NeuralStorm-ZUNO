import {useNavigate} from "react-router-dom";
import {useState} from "react";
export default function RoleSwitcher(){
 const navigate=useNavigate(); const [role,setRole]=useState(()=>localStorage.getItem("zuno_user_role")||"student");
 const change=e=>{const next=e.target.value;setRole(next);localStorage.setItem("zuno_user_role",next);navigate(next==="student"?"/dashboard":next==="teacher"?"/teacher":"/admin");};
 return <label className="global-control"><span>View as</span><select aria-label="Change role" value={role} onChange={change}><option value="student">Student</option><option value="teacher">Teacher</option><option value="admin">Admin</option></select></label>;
}
