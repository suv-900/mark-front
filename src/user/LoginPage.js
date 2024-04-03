import React, { Suspense } from 'react';
import { render } from 'react-dom';
import {ChatPage} from '../chat/ChatPage';
import Loading from '../chat/Loading';
export default function LoginPage(){
        
    async function submitLoginForm(){
            const outputDiv=document.getElementById("outputDiv");
            
            const form=document.getElementById("loginForm");
            const username=form.elements[0].value;
            const password=form.elements[1].value;

            if(username.length === 0 || password.length === 0){
                outputDiv.innerHTML="missing fields";
                return;
            }
        
            // loginUserWebSocket(username,password); 
            const reqbody=JSON.stringify({username,password});
            const response= await fetch("http://localhost:8080/users/login",{
                method:"post",
                body:reqbody
            })
            
            const responsetext=await response.text();
            const status=response.status;
              
            if(status === 200){
                const token=response.headers.get("Token");
                localStorage.setItem("Token",token);
                render(
                <Suspense fallback={<Loading/>}>
                    <ChatPage username={username} password={password}/>
                </Suspense>,document.getElementById("app"));
            }else if(status === 500){
                outputDiv.innerhtml=status+" "+responsetext;
                   
            }else if(status === 401){
                outputDiv.innerhtml=status+" "+responsetext;
            }else if(status === 400){
                outputDiv.innerhtml=status+" "+responsetext;
                   
            }else{
                outputDiv.innerhtml="unknown error "+status+" "+responsetext;
            }
           
    }
    
    return(
        <div>
            <form id="loginForm">
                <input type="text" placeholder="username" required /><br></br>
                <input type="password" placeholder="password" required /><br></br>
            <button type="button" onClick={()=>{submitLoginForm()}}>submit</button>
        </form>
        <div id="outputDiv"></div>

        </div>
    )
}