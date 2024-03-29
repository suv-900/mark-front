import React from "react";
import {useEffect} from 'react';
//pub sub
export default function ContactArea({token}){

    useEffect(()=>{
        getContacts();
    },[])

    async function getContacts(){
        const reqHeaders={"Token":token};
        const res=await fetch("http://localhost:8080/users/getFriends",{
            method:"GET",
            headers:reqHeaders
        })
 
        const friendsListJSON=await res.json();
        const contactAreaDiv=document.getElementById("contact-area");
        for(let i=0;i<friendsListJSON.length;i++){
            const friend=friendsListJSON[i];

            const friendDiv=document.createElement("div");
            friendDiv.id=friend.userID;
            friendDiv.className="friend";

            const username=document.createElement("a");
            // username.href=`http://localhost:8080/users/getuser/${friend.username}`;
            username.text=friend.username;
            username.className="username";
            friendDiv.appendChild(username);

            // const id=document.createElement("div");
            // id.innerText=friend.userID;
            // friendDiv.appendChild(id);
                            
            const chatButton=document.createElement("button");
            chatButton.innerText="chat";
            chatButton.type="button";
            chatButton.className="chat-button";
            // chatButton.onclick=`http://localhost:8080/chat?chatID=${friend.chatID}`;
            friendDiv.appendChild(chatButton);

            const online=document.createElement("div");
            online.innerText="●";
            online.className=friend.online? "online":"offline"
            friendDiv.appendChild(online);
                            

            contactAreaDiv.appendChild(friendDiv);
        } 
    }
    //onclick render componenet open ws connection
    function chat(username,userid){
        
    }
    return(
        <div id="contact-area">

        </div>
    )
}