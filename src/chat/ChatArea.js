import React, { useState,useEffect } from "react"

export default function ChatArea({friendID,friendName,renderComponent,username,password}){
    const[valid,setValid]=useState(false);
    const[ws,setWS]=useState(null);
    const[message,setMessage]=useState(null);

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
            console.log("E "+e);
            console.log("data: "+e.data);
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
        

        if(message === null){
            console.log("Message length 0");
            return;
        }
        const messageObject={
            from:username,
            to:friendName,
            messageContent:message,
            messageType:"MESSAGE"
        }
        
        const messageJSON=JSON.stringify(messageObject);

        ws.send(messageJSON);

        const sendingMessagesDiv=document.getElementById("sendingMessages-area");
        
        const wrapperDiv=document.createElement("div");
        
        const messageDiv=document.createElement("div");
        messageDiv.innerHTML=message;
        messageDiv.className="sender";
        

        const timeDiv=document.createElement("div");
        const d=new Date();
        timeDiv.innerHTML=d.getTime();
        timeDiv.className="timestamp";

        wrapperDiv.appendChild(messageDiv);
        wrapperDiv.appendChild(timeDiv);
        sendingMessagesDiv.appendChild(wrapperDiv);
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
                
                <div id="text-area" className="input-area">
                    <input type="text" placeholder="send message..." onChange={(e)=>{setMessage(e.target.value)}}/>
                    <button type="button" onClick={()=>{sendMessage()}}>send</button>
                </div>
            </div>
            :<div>
               <h4>Empty :(</h4> 
            </div>}
        </div>
    )
}