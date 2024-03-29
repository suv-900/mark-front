import {useEffect} from 'react';

export default function WebSocketComponent(){
    async function connectWS(){
        const ws=new WebSocket("ws://localhost:8080/chat");

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



    return(
        <div>
            Websocket check console.
            <button onClick={()=>{connectWS()}}>socket!</button>
        </div>
    )
}
