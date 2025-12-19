import axios from "axios";
import type {User} from "@/types/user"

export async function registration(user:User)
{
    const{data}= await axios.post("/(auth routes)/sing-up/",user,{
        headers: {
            "Content-Type":"application/json"
        }
    });
    return data;
}

export async function login(user:User)
{
    const{data} = await axios.post("//(auth routes)/sing-in/",user,{
        headers:{
            "Content-Type":"application/json"
        }
    });
    return data;
}