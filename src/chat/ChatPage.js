import React from "react";
import LoginPage from "../user/LoginPage";
import ContactArea from "./ContactArea";
import ChatArea from "./ChatArea";
import Loading from "./Loading";
import {useEffect,useState,Suspense} from 'react';
import {render} from 'react-dom';

function ChatPage({username,password}){
    
    useEffect(()=>{
        const storedToken=localStorage.getItem("Token");
        if(storedToken === null){
            renderLoginPage()
        }else{
            verifyToken(); 
        } 
    },[])
    
    async function verifyToken(){
        const token=localStorage.getItem("Token");
        const reqHeaders={"Token":token};
        const response=await fetch("http://localhost:8080/users/verifytoken",{
            method:"POST",
            headers:reqHeaders
        })
            
        const responseText=await response.text();
        const status=response.status;
        if(status === 200){
            return;
        }else{
            console.log("response status:"+status+" "+responseText);
            renderLoginPage();
        } 
        
    } 
    
    return(
        <div id="chatpage-container" className="chat-container">
        {/* 
            <form>
                <input type="text" placeholder="search user"/>
                <button onClick={()=>{}}>Search</button>
            </form> */}

            <div id="contact-area" className="contact-area">
                <Suspense fallback={<Loading/>}>
                    <ContactArea username={username} password={password} />
                </Suspense>
            </div>
            
            <div id="chat-area" className="chat-area" >
                <Suspense fallback={<Loading/>}>
                    <ChatArea render={false}/>
                </Suspense>
            </div> 
            
        </div>
    )
}
    function renderLoginPage(){
        render(<LoginPage />,document.getElementById("app"));
    }

export {ChatPage,renderLoginPage}
 