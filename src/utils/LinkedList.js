class Node{
            constructor(data){
                this.data=data;
                this.prev=null;
                this.next=null
            }
        }

export default class LinkedList{
            constructor(){
                this.head=null;
                this.tail=null;
                this.length=0;
            }

            add(data){
                const newNode=new Node(data);
                if(this.head === null){
                    this.head=newNode;
                    this.tail=this.head;
                    this.length++;
                    return this;
                }else{
                    this.tail.next=newNode;
                    newNode.prev=this.tail;
                    this.tail=newNode;
                    this.length++;
                    return this;
                }
            }

            pop(){
                if(this.head === null){
                    return;
                }else{
                
                this.tail=this.tail.prev;
                this.tail.next=null;
                this.length--;
                }
            }

            get(index){
                if(index < this.length && index>=0 ){
                    let temp=this.head;
                    for(let i=0;i<index;i++){
                       temp=temp.next; 
                    }
                    return temp.data;
                }else{
                    throw new RangeError("Index out of bounds");
                }
            
            }
            removeAt(index){
                if(index < this.length && index >= 0){
                    if(index === this.length-1){
                        this.pop();
                        return;
                    }
                    if(index === 0){
                        this.head=this.head.next;
                        this.length--;
                        return;
                    }
                    let temp=this.head;
                    for(let i=0;i<index;i++){
                       temp=temp.next; 
                    }
                    temp.prev=temp.next;
                    temp.next.prev=temp.prev;
                    temp=null;
                    this.length--;
                }else{
                    throw new RangeError("Index out of bounds");
                }
            }
            
        }

