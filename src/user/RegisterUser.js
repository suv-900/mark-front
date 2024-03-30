import React from 'react';
import {render} from 'react-dom';
import ChatPage from '../chat/ChatPage';

export default function RegisterUser(){
        async function registerUser(){
            const outputDiv=document.getElementById("outputDiv");
            const form=document.getElementById("registerForm");
            const username=form.elements[0].value;
            const email=form.elements[1].value;
            const password=form.elements[2].value;

            if(username.length === 0 || password.length === 0 || email.length === 0){
                outputDiv.innerHTML="Missing fields";
                return;
            }
            
            // if(username.length < 5){
            //     outputDiv.innerHTML="Username too short.";
            //     return;
            // }
            
            // if(password.length < 5){
            //     outputDiv.innerHTML="Password too short";
            //     return;
            // }
            // const passwordSize=password.length >= 5 && password.length <= 20;
            // const passwordNumeric=/\d/.test(password);
            // const passwordSpecialChar=/[$#&@]/.test(password);

            // if(!(passwordSize && passwordNumeric && passwordSpecialChar)){
            //     outputDiv.innerHTML="Password must be less than 20 and must contain one digit and a special char[$#&@].";
            //     return;
            // }

            const emailCheck=/@gmail.com/.test(email);
            
            if(!emailCheck){
                outputDiv.innerHTML="Email invalid";
                return;
            }
            
            const reqBody=JSON.stringify({username,email,password});
            console.log(reqBody);

            const response=await fetch("http://localhost:8080/users/register",{
                method:"POST",
                body:reqBody
            })
            const responseText=await response.text();
            
            const status=response.status;
                
            if(status === 200){
                const token=response.headers.get("Token");
                localStorage.setItem("Token",token);
                
                console.log("adding user to xmpp server"); 
                
                registerUserWebSocket(username,password);
                
                console.log("process finished");
                //render chatPage
                const app=document.getElementById("app");
                
                // render(<ChatPage username={username} password={password} />,app);

            }else if(status === 500){
                outputDiv.innerHTML=status+" "+responseText;
                    
            }else if(status === 401){
                outputDiv.innerHTML=status+" "+responseText;
            }else if(status === 400){
                outputDiv.innerHTML=status+" "+responseText;
                    
            }else{
                outputDiv.innerHTML="Unknown error "+status+" "+responseText;
            }
        }
        function registerUserWebSocket(username,password){
        const obj={
            from:username,
            messageContent:password,
            messageType:"REGISTER"
        }
            
        const message=JSON.stringify(obj); 

        const ws=new WebSocket("ws://localhost:8080/chat");

        ws.onopen=()=>{
            console.log("Connection open.");
            ws.send(message);
        }

        ws.onerror=(e)=>{
            console.log("Error "+e);
        }
        ws.onmessage=(e)=>{
            console.log(JSON.parse(e.data));
        }
        ws.onclose=(e)=>{
            console.log("Connection closed.");
        }  
        }
    
        return(
        <div>
             <form id="registerForm" className="form">
            <input id="username" className="input-field" placeholder="username" type="text" required/><br></br>
            <input id="email" className="input-field" placeholder="email" type="email" required/><br></br>
            <input id="password" className="input-field" placeholder="password" type="password" required/><br></br>
            <button type="button" className="button" onClick={()=>{registerUser()}}>submit</button>
        </form>
        <div id="outputDiv"></div>
        </div>
    )
}
