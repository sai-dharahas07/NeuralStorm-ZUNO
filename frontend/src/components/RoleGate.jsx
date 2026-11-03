import {Navigate} from 'react-router-dom';
export default function RoleGate({allow,children}){const role=localStorage.getItem('zuno_user_role')||'student';return allow.includes(role)?children:<Navigate to={role==='student'?'/dashboard':'/staff-access'} replace/>}
