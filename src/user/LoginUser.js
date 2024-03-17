import React from 'react';

export default function LoginUser(){
        
    async function submitLoginForm(){
            const outputDiv=document.getElementById("outputDiv");
            
            const form=document.getElementById("loginForm");
            const username=form.elements[0].value;
            const password=form.elements[1].value;

            if(username.length === 0 || password.length === 0){
                outputDiv.innerHTML="missing fields";
                return;
            }
        
            
            const reqBody=JSON.stringify({username,password});
            const response= await fetch("http://localhost:8080/users/login",{
                method:"POST",
                body:reqBody
            })
            
            const responseText=await response.text();
            const status=response.status;
              
            if(status === 200){
                const token=response.headers.get("Token");
                localStorage.setItem("Token",token);
                outputDiv.innerHTML=status+" "+responseText;
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
        // async function submitLoginForm(){
    //         const form=document.getElementById("loginForm");
    //         const outputDiv=document.getElementById("outputDiv");
    //         const username=form.elements[0].value;
    //         const password=form.elements[1].value;

    //         if(username.length === 0 || password.length === 0){
    //             outputDiv.innerHTML="missing fields";
    //             return;
    //         }
                        
    //         const reqBody=JSON.stringify({username,password});
    //         const xhttp=new XMLHttpRequest();
            
    //         xhttp.onreadystatechange=()=>{
    //             if(xhttp.readyState===4){
    //                 const status=xhttp.status;
    //                 let token;
    //                 if(status===200){
    //                     token=xhttp.getResponseHeader("Token");
    //                     console.log(token);
    //                     localStorage.setItem("Token",token);
    //                     outputDiv.innerHTML=status;
    //                 }else if(status === 500){
    //                     outputDiv.innerHTML=500+" Server Error";
    //                 }else if(status === 401){
    //                     // document.createElement("error").setAttribute()
    //                     outputDiv.innerHTML=401+" Unauthorised";
    //                 }else if(status === 400){
    //                     outputDiv.innerHTML="400 Bad Request";
    //                 }else{
    //                     outputDiv.innerHTML="something happend";
    //                 }
    //             }
    //     }
    //     xhttp.open("POST","http://localhost:8080/users/login",true)
    //     xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    //     xhttp.send(reqBody);
    // }
 
 
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