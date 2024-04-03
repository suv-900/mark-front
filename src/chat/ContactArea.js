import React from "react";
import { render } from "react-dom";
import {useEffect} from 'react';
import ChatArea from "./ChatArea";
import {createRoot} from 'react-dom/client'
//pub sub
export default function ContactArea({username,password}){
    let chatRoot;
    useEffect(()=>{
        const dom=document.getElementById("chat-area");
        chatRoot=createRoot(dom);

        getContacts();
    },[])

    
    async function getContacts(){
        const token=localStorage.getItem("Token");
        const reqHeaders={"Token":token};
        
        const res=await fetch("http://localhost:8080/users/getFriends",{
            method:"GET",
            headers:reqHeaders
        })
        
        if(res.status === 200){

        const friendsListJSON=await res.json();
        const contactListDiv=document.getElementById("contact-list");
        console.log(contactListDiv);
        for(let i=0;i<friendsListJSON.length;i++){
            const friend=friendsListJSON[i];

            const friendDiv=document.createElement("div");
            friendDiv.id=friend.userID;
            friendDiv.className="contact-item";
            friendDiv.onclick=()=>{
                console.log("clicked");
                chatRoot.render(<ChatArea friendID={friend.userID} friendName={friend.username} 
                        renderComponent={true} 
                        username={username} 
                        password={password}/>)}
            
            const friendUsername=document.createElement("a");
            friendUsername.text=friend.username;
            friendUsername.className="username";
            friendDiv.appendChild(friendUsername);
            
            const online=document.createElement("div");
            online.innerText="●";
            online.className=friend.online? "online":"offline"
            friendDiv.appendChild(online);
                            
            contactListDiv.appendChild(friendDiv);
        } 
        }else{
            console.log(res.status);
        }
    }
    //onclick render componenet open ws connection
    function chat(toUserID,friendName,renderComponent){
        console.log("who clicked");
            }
    return(
        <div>
            <div id="contact-list" className="contact-list"></div>
        </div>
    )
}