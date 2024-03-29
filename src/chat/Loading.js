import React from "react";
import { useEffect,useState } from "react";

export default function Loading(){
    const[str,setStr]=useState("Loading");

    useEffect(()=>{
        let count=0;
        for(let i=0;i<10;i++){
            setTimeout(()=>{
                count++;
                if(count === 3){
                    setStr("Loading");
                    count=0;
                }if(count === 0){
                    setStr("Loading.")
                }if(count === 1){
                    setStr("Loading..")
                }if(count === 2){
                    setStr("Loading...")
                }
            },800)
        }
    },[])
    return(
        <div>
           <h5>{str}</h5> 
        </div>
    )
}