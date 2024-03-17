import React from 'react';
import '../App.css'
import LinkedList from '../utils/LinkedList'
import { useEffect } from 'react';

export default function Friends(){
    let tokenValid=false;
    let outputDiv;
    let token;
    let friendRequestsList;
    let friendsList;
    let friendRequestDiv;
    let friendsListDiv;
    
    useEffect(()=>{
        friendRequestsList=new LinkedList();
        friendsList=new LinkedList();
        friendsListDiv=document.getElementById("friendsList");
        friendRequestDiv=document.getElementById("friendRequestsList");

        checkToken()
        setTimeout(()=>{
            if(tokenValid){
                fetchFriendsList();
                fetchPendingFriendRequests();
            }
        },800);
    },[])    

    async function checkToken(){
        outputDiv=document.getElementById("outputDiv");    
        token=localStorage.getItem("Token");
        
        if(token === null){
            outputDiv.innerHTML="Login required";
            const anchorElement=document.createElement("a");
            anchorElement.href="localhost:/login";
            anchorElement.text="login";
            outputDiv.appendChild(anchorElement);
            return;
        }
            
            const reqHeaders={"Token":token};
            const response=await fetch("http://localhost:8080/users/verifytoken",{
                method:"POST",
                headers:reqHeaders
            })
            
            const responseText=await response.text();
            const status=response.status;
            if(status === 200){
                tokenValid=true;
                return;
            } 
            if(status === 500){
                outputDiv.innerHTML=500+" "+responseText;
            }
            if(status === 401){
                const anchorElement=document.createElement("a");
                anchorElement.href="localhost:8080/users/login";
                anchorElement.text="login";
                outputDiv.appendChild(anchorElement);
                outputDiv.innerHTML=401+" "+responseText;
            }else{
                outputDiv.innerHTML=status+" "+responseText;
            }
        }
        
        async function fetchFriendsList(){
            if(!tokenValid || isEmpty(token)) return; 


            
            const reqHeaders={"Token":token};
            const response=await fetch("http://localhost:8080/users/getFriends",{
                method:"GET",
                headers:reqHeaders
            })
            const status=response.status;
            const statusDiv=document.getElementById("friendsListStatusDiv");
            
            if(status === 200){
                const friendsListJSON=await response.json();
                console.log(friendsListJSON);
                
                if(friendsListJSON.length === 0){
                    const headerDiv=document.getElementById("friendsListHeader");
                    headerDiv.innerText="Friends 0";
                    return;
                }
                        for(let i=0;i<friendsListJSON.length;i++){
                            //id,username,email,online
                            const friend=friendsListJSON[i];

                            const friendDiv=document.createElement("div");
                            friendDiv.id=friend.userID;
                            
                            const username=document.createElement("a");
                            username.href=`http://localhost:8080/users/getuser/${friend.username}`;
                            username.text=friend.username;
                            friendDiv.appendChild(username);

                            const id=document.createElement("div");
                            id.innerText=friend.userID;
                            friendDiv.appendChild(id);
                            
                            const email=document.createElement("div");
                            email.innerText=friend.emailID;
                            friendDiv.appendChild(email);
                            
                            const chatButton=document.createElement("button");
                            chatButton.innerText="chat";
                            chatButton.type="button";
                            chatButton.onclick=`http://localhost:8080/chat?chatID=${friend.chatID}`;
                            friendDiv.appendChild(chatButton);

                            const online=document.createElement("div");
                            online.innerText=friend.online;
                            friendDiv.appendChild(online);
                            
                            const fList=document.createElement("li");
                            fList.id=friend.userID;
                            fList.appendChild(friendDiv);

                            friendsList.add(friendDiv);
                            friendsListDiv.appendChild(fList);
                        }
                        const headerDiv=document.getElementById("friendsListHeader");
                        headerDiv.innerHTML="Friends "+friendsList.length; 
                    } 
                    else if(status === 500){
                        const responseText=await response.text();
                        statusDiv.innerHTML=status+" "+responseText;
                    }
                    else if(status === 401){
                        const anchorElement=document.createElement("a");
                        anchorElement.href="localhost:8080/users/login";
                        anchorElement.text="login";
                        statusDiv.appendChild(anchorElement);
                    }else{
                        const responseText=await response.text();
                        outputDiv.innerHTML=status+" "+responseText;
                    }

       } 


        async function fetchPendingFriendRequests(){
            if(!tokenValid || isEmpty(token)) return; 
            
            
            const reqHeaders={"Token":token};
            const response=await fetch("http://localhost:8080/users/getPendingFriendRequests",{
                method:"GET",
                headers:reqHeaders
            })
            
            const status=response.status;
            const statusDiv=document.getElementById("friendRequestStatusDiv"); 
            
            if(status === 200){
                const requestList=await response.json();
                
                if(requestList.length === 0){
                    const headerDiv=document.getElementById("friendRequestsHeader");
                    headerDiv.innerText="Friend Requests 0";
                    return;
                }
                        
                       
                for(let i=0;i<requestList.length;i++){
                    //id,username,email,online
                    const request=requestList[i];

                    const requestDiv=document.createElement("div");
                    requestDiv.id=i;

                    const requestText=document.createElement("div");
                    requestText.innerText=request.senderUsername+" "+request.createdAt;
                    requestDiv.appendChild(requestText);
                            
                    const acceptButton=document.createElement("button");
                    acceptButton.type="button";
                    acceptButton.innerText="accept";
                    acceptButton.onclick=()=>{acceptFriendRequest(request.fromUserID,request.senderUsername,i)};
                    requestDiv.appendChild(acceptButton);

                    const denyRequestButton=document.createElement("button");
                    denyRequestButton.type="button";
                    denyRequestButton.innerText="deny";
                    denyRequestButton.onclick=()=>{denyFriendRequest(request.fromUserID,request.senderUsername,i)};
                    requestDiv.appendChild(denyRequestButton);

                    friendRequestsList.add(requestDiv);
                    friendRequestDiv.appendChild(requestDiv);
                }
                const headerDiv=document.getElementById("friendRequestsHeader");
                headerDiv.innerHTML="Friend Requests "+requestList.length; 
                } 
                else if(status === 500){
                    const responseText=await response.text();
                    statusDiv.innerHTML=status+" "+responseText;
                }
                else if(status === 401){
                    const anchorElement=document.createElement("a");
                    anchorElement.href="localhost:8080/users/login";
                    anchorElement.text="login";
                    statusDiv.appendChild(anchorElement);

                }else{
                    const responseText=await response.text();
                    statusDiv.innerHTML=status+" "+responseText;

                }

    }

    async function sendFriendRequest(){
        if(!tokenValid || isEmpty(token)) return; 
            
        const toUsername=document.getElementById("sendFriendRequestInput").value;
        const statusDiv=document.getElementById("requestStatusDiv");
        
        if( isEmpty(toUsername)){
            statusDiv.innerHTML="empty fields";
            return;
        }
        
        const reqBody=JSON.stringify({"ToUsername":toUsername});
        const reqHeaders={"Token":token};
        const response=await fetch("http://localhost:8080/users/sendFriendRequest",{
            method:"POST",
            headers:reqHeaders,
            body:reqBody
        })

        const status=response.status;

        const responseText=await response.text();
        if(status === 200){
            statusDiv.innerHTML=status+" "+responseText;
        }else if(status === 500){
            statusDiv.innerHTML=status+" "+responseText;
        }else if(status  === 401){
            const link=document.createElement("a");
            link.href="localhost:8080/users/login";
            link.text="login";
            statusDiv.appendChild(link);
        }else{
            statusDiv.innerHTML=status+" "+responseText;
        }
    }

        async function acceptFriendRequest(fromUserID,username,index){
            if(!tokenValid) return; 
            
            const statusDiv=document.getElementById("friendRequestStatusDiv");
            statusDiv.innerHTML=null;

           
            //check
            if(isEmpty(username) || fromUserID === null || index === null){
                statusDiv.innerHTML="Bad Element";
                return;
            }
            const reqHeaders={"Token":token}
            const response=await fetch(`http://localhost:8080/users/acceptFriendRequest?username=${username}`,{
                method:"POST",
                headers:reqHeaders
            })

            const responseText=await response.text();
            const status=response.status;
            if(status === 200){
                addFriendToList(fromUserID,index);
                statusDiv.innerHTML=status+" "+responseText;
            }else if(status === 500){
                statusDiv.innerHTML=status+" "+responseText;
            }else if(status === 401){
                const link=document.createElement("a");
                link.href="localhost:8080/users/login";
                link.text="login";
                statusDiv.appendChild(link);
            }else{
                statusDiv.innerHTML=status+" "+responseText;
            }

        }

        async function denyFriendRequest(fromUserID,username,index){
            if(!tokenValid) return;

            const statusDiv=document.getElementById("friendRequestStatusDiv");
            statusDiv.innerHTML=null;
           
            //check
            if(isEmpty(username) || fromUserID === null || index === null){
                statusDiv.innerHTML="Bad Element";
                return;
            }
            
            const reqHeaders={"Token":token}
            const response=await fetch(`http://localhost:8080/users/denyFriendRequest?fromUserID=${fromUserID}`,{
                method:"POST",
                headers:reqHeaders
            })

            const responseText=await response.text();
            const status=response.status;
            if(status === 200){
                friendRequestDiv.removeChild(friendRequestsList.get(index)); 
                statusDiv.innerHTML=status+" "+responseText;
            }else if(status === 500){
                statusDiv.innerHTML=status+" "+responseText;
            }else if(status === 401){
                const link=document.createElement("a");
                link.href="localhost:8080/users/login";
                link.text="login";
                statusDiv.appendChild(link);
            }else{
                statusDiv.innerHTML=status+" "+responseText;
            }


        }
        
        async function addFriendToList(userID,index){
            const statusDiv=document.getElementById("friendRequestStatusDiv");
            if(userID === undefined){
                statusDiv.innerHTML="userID is undefined";
            }

            statusDiv.innerHTML=null;
            const reqHeaders={"Token":token};
            const response=await fetch(`http://localhost:8080/users/getOneFriend?userID=${userID}`,{
                method:"GET",
                headers:reqHeaders
            })

            const status=response.status;

            if(status === 200){
                const friend=await response.json();
                setTimeout(()=>{

                    const friendDiv=document.createElement("div");
                    friendDiv.id=friend.userID;
                            
                    const username=document.createElement("a");
                    username.href=`http://localhost:8080/users/getuser/${friend.username}`;
                    username.text=friend.username;
                    friendDiv.appendChild(username);

                    const id=document.createElement("div");
                    id.innerText=friend.userID;
                    friendDiv.appendChild(id);
                            
                    const email=document.createElement("div");
                    email.innerText=friend.emailID;
                    friendDiv.appendChild(email);
                            
                    const online=document.createElement("div");
                    online.innerText=friend.online;
                    friendDiv.appendChild(online);
                            
                    const fList=document.createElement("li");
                    fList.id=friend.userID;
                    fList.appendChild(friendDiv);
                    let a=[];
                            
                    friendsList.add(friendDiv);
                    friendsListDiv.appendChild(fList);
                            
                    friendRequestDiv.removeChild(friendRequestsList.get(index));
                    friendRequestsList.removeAt(index);
                    status.innerHTML=status+" OK";

                }) 
            }else if(status === 401){
                const link=document.createElement("a");
                link.href="localhost:8080/users/login";
                link.text="login";
                statusDiv.appendChild(link);
            }else if(status === 500){
                const responseText=await response.text();
                statusDiv.innerHTML=status+" "+responseText;
            }else{
                const responseText=await response.text();
                statusDiv.innerHTML=status+" "+responseText;
            }

        }
    
    function isEmpty(s){
            return s.length === 0 ? true:false;
    }

    return(
        <div>
            <div className="container">
            <div id="friendsDiv" className="table"> 
                <h2 id="friendsListHeader">Friends</h2>
                <ul id="friendsList">
                </ul>
            </div>
            <div id="friendRequestsDiv"  className="table">
                <h2 id="friendRequestsHeader">Friend Requests</h2>
                <ul id="friendRequestsList">
                    
                </ul>
            </div>
        </div>
        
        <div>
            <a >accept</a>
            <a >deny</a>
        </div>

        <form id="addUserForm">
            <input id="sendFriendRequestInput" type="text" placeholder="add user" required/><br></br>
            <button type="button" onClick={()=>{sendFriendRequest()}}>send</button>
        </form>
        <div id="friendListStatusDiv" ></div>
        <div id="friendRequestStatusDiv" ></div>
        <div id="outputDiv" ></div>

        </div>
    )
}