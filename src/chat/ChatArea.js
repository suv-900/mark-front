import React, { useState,useEffect } from "react"

export default function ChatArea({friendID,friendName,renderComponent,username,password}){
    const[valid,setValid]=useState(false);
    const[ws,setWS]=useState(null);

    useEffect(()=>{
        if(renderComponent === true && (friendID !== null && friendName !== null && username !== null && password !== null)){
            setValid(true);
            fetchMessages();
            connect();
        }else{
           setValid(false); 
        }
    },[])

    function connect(){
        const ws=new WebSocket("ws://localhost:8080/chat");
        setWS(ws);
        
        const messageObject={
            "from":username,
            "messageContent":password,
            "messageType":"CONNECT"
        }
        
        const messageJSON=JSON.stringify(messageObject);
        
        ws.onopen=()=>{
            console.log("Connection open.");
            
            ws.send(messageJSON);
        }
        ws.onerror=(e)=>{
            console.log("Error "+e);
        }
        ws.onmessage=(e)=>{
            
            const message=JSON.parse(e.data);
            console.log(message);
            
            const receivingMessagesDiv=document.getElementById("receivingMessages-area");
            const wrapperDiv=document.createElement("div");
        
            const messageDiv=document.createElement("div");
            messageDiv.innerHTML=message.messageContent;
            messageDiv.className="receiver";
            
            const timeStamp=getTime();
            const timeDiv=document.createElement("div");
            timeDiv.innerHTML=timeStamp;
            timeDiv.className="timestamp";


            wrapperDiv.appendChild(messageDiv);
            wrapperDiv.appendChild(timeDiv);

            receivingMessagesDiv.appendChild(wrapperDiv);
        }
        ws.onclose=(e)=>{
            console.log("Connection closed.");
        }
    }
    function sendMessage(){
        if(ws === null){
            console.log("ws is null cannot sendMessage.");
            return;
        } 
        
        const form=document.getElementById("text-area");
        const message=form.elements[0].value;

        if(message === null){
            return;
        }
        const messageObject={
            from:username,
            to:friendName,
            messageContent:message,
            messageType:"MESSAGE",
        }
        
        const messageJSON=JSON.stringify(messageObject);

        ws.send(messageJSON);
        
        const sendingMessagesDiv=document.getElementById("sendingMessages-area");
        
        const wrapperDiv=document.createElement("div");
        
        const messageDiv=document.createElement("div");
        messageDiv.innerHTML=message;
        messageDiv.className="sender";
        
        const timeStamp=getTime();
        console.log(timeStamp);
        const timeDiv=document.createElement("div");
        timeDiv.innerHTML=timeStamp;
        timeDiv.className="timestamp";

        wrapperDiv.appendChild(messageDiv);
        wrapperDiv.appendChild(timeDiv);
        sendingMessagesDiv.appendChild(wrapperDiv);
    }
    function getTime(){
        const now = new Date();
        let hours = now.getHours();
        const amPM = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; 
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeStamp=`${hours}:${minutes}:${seconds} ${amPM}`;
        
        return timeStamp;

    }

    async function fetchMessages(){
        const token=localStorage.getItem("Token");
        const reqHeaders={"Token":token};

        const response=await fetch(`http://localhost:8080/users/getMessages?userID=${friendID}`,{
            method:"GET",
            headers:reqHeaders
        })
        
        const status=response.status;
        if(status === 200){
            const responseJSON=await response.json();
            const sendingMessagesDiv=document.getElementById("sendingMessages-area");
            const receivingMessagesDiv=document.getElementById("receivingMessages-area");
            
            console.log(responseJSON); 
            
            for(let i=0;i<responseJSON.length;i++){
                const message=responseJSON[i];
                
                const messageDiv=document.createElement("div");
                messageDiv.id=message.messageID;
                messageDiv.innerHTML=message.messageContent;
                
                const timeDiv=document.createElement("div");
                const time=removeDate(message.createdAt);

                timeDiv.innerHTML=time;
                timeDiv.className="timestamp";

                const wrapperDiv=document.createElement("div");
                wrapperDiv.className="message-Wrapper";
                wrapperDiv.appendChild(messageDiv);
                wrapperDiv.appendChild(timeDiv);
                if(message.messageType === "sending"){
                    sendingMessagesDiv.appendChild(wrapperDiv);
                    messageDiv.className="sender";
                }
                if(message.messageType === "receiving"){
                    receivingMessagesDiv.appendChild(wrapperDiv);
                    messageDiv.className="receiver";
                }
            }
        }else{
            const responseText=await response.text();
            console.log("Status:"+status+" responseText:"+responseText);
        }
    }
    function removeDate(s){
        let commas=0;
        for(let i=0;i<s.length;i++){
            if(s[i] === ','){
                commas++;
            }
            if(commas === 2){
               return s.substring(i+1,s.length); 
            }
        }
    }
    return(
        <div>
            {valid && renderComponent ? 
            <div>
                <div id="messages" className="message-container"> 
                    <div id="receivingMessages-area" className="receiver-messsage-container" ></div> 
                    <div id="sendingMessages-area"  className="sender-message-container" ></div>
                </div>
                
                <form id="text-area" className="input-area">
                    <input type="text" placeholder="send message..."/> 
                    <button type="button" onClick={(e)=>{sendMessage(e.timeStamp)}} >send</button>
                </form>
            </div>
            :<div>
               <h4>Empty :(</h4> 
            </div>}
        </div>
    )
}