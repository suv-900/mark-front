import { renderLoginPage } from "./ChatPage";
import React, { useState,useEffect } from "react"
//turn on websocket to user
export default function ChatArea({username,render,friendName,friendID}){
    const[valid,setValid]=useState(false);
    const[ws,setWS]=useState(null);

    useEffect(()=>{
        if(render === false || friendName.length === 0 || friendID === null || username.length === 0){
            setValid(false)
        }else{
            setValid(true);
            fetchMessages(friendID);
            connect();
        }
    },[])

    function connect(){
        const ws=new WebSocket("ws://localhost:8080/chat");
        setWS(ws);
        
        ws.onopen=()=>{
            console.log("Connection open.");
            
            const obj={"messageType":"OK"};
            const s=JSON.stringify(obj);
            ws.send(s);
        }
        ws.onerror=(e)=>{
            console.log("Error "+e);
        }
        ws.onmessage=(e)=>{
            console.log("E "+e);
            console.log("data: "+e.data);
        }
        ws.onclose=(e)=>{
            console.log("Connection closed.");
        }
        console.log("Something happened");
    }

    function disconnect(){
        if(ws === null){
            console.log("ws is null cannot disconnect.");
            return;
        }
        if(ws.OPEN){
            ws.close();
        }
    }
    async function fetchMessages(friendID){
        const reqBody=JSON.stringify({"friendID":friendID});

        const response=await fetch("http://localhost:8080/users/getMessages",{
            method:"GET",
            body:reqBody,
        })
            
        const status=response.status;
        if(status === 200){
            const responseJSON=await response.json();
            const sendingMessagesDiv=document.getElementById("sendMessages-area");
            const receivingMessagesDiv=document.getElementById("receivingMessages-area");
            
            
            for(let i=0;i<responseJSON.length;i++){
                const message=responseJSON[i];
                
                const messageDiv=document.createElement("div");
                messageDiv.id=i;
                messageDiv.innerHTML=message.content;
                
                if(message.type === "sending"){
                    sendingMessagesDiv.appendChild(messageDiv);
                }
                if(message.type === "receiving"){
                    receivingMessagesDiv.appendChild(messageDiv);
                }
            }
        }if(status === 401){
        }else{
            //unknown error
        }
    }

    return(
        <div>
            {valid && render ? 
            <div>
                <div id="messages">
                    <div id="sendingMessages-area" ></div>
                    <div id="receivingMessages-area" ></div> 
                </div>
                
                <form id="text-area" >
                    <input type="text" placeholder="send message..." />
                    <button>send</button>
                </form>
                <button onClick={()=>{connect()}}>connect</button>
                <button onClick={()=>{disconnect()}}>disconnect</button>
            </div>
            :<div>
               <h4>Empty :(</h4> 
            </div>}
        </div>
    )
}