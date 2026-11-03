import {useState} from "react";
export default function ThemeToggle(){
 const [dark,setDark]=useState(()=>localStorage.getItem("zuno_theme")==="dark");
 const toggle=()=>{const next=!dark;setDark(next);localStorage.setItem("zuno_theme",next?"dark":"light");window.dispatchEvent(new Event("zuno-theme-change"));};
 return <button className="theme-toggle" type="button" onClick={toggle} aria-pressed={dark}>{dark?"☀️ Light mode":"🌙 Dark mode"}</button>;
}
