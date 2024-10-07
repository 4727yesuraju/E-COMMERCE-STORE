import {create} from 'zustand';
import axios from '../libs/Axios';
import {toast} from 'react-hot-toast';

export const useUserStore = create((set,get)=>({
    user : null,
    loading : false,
    checkingAuth : true,

    signup : async ({name,email, password, confirmPassword})=>{
        set({loading : true});
        if(password!==confirmPassword){
            set({loading : false});
            return toast.error("Password do not match");
        }

        try {
            const res = await axios.post("/auth/signup",{name,email,password});
            set({user : res.data.user,loading : false});
            toast.success(res.data.message);
        } catch (error) {
            set({loading : false})
            toast.error(error.response.data.error || error.message)
        }
    },

    login : async (email, password)=>{
        set({loading : true});

        try {
            const res = await axios.post("/auth/login",{email,password});

            console.log("login : ",res.data);
            set({user : res.data.user,loading : false});
            toast.success(res.data.message);
        } catch (error) {
            set({loading : false})
            console.log(error);
            toast.error(error.response.data.error || error.message)
        }
    },

    logout : async ()=>{
       try {
          await axios.post("/auth/logout");
          set({user : null})
       } catch (error) {
          toast.error(error.response?.data?.error || error.message)
       }
    },

    checkAuth : async ()=>{
        set({checkingAuth : true});
        try {
            const res = await axios.get("/auth/profile");
            set({user : res.data.user,checkingAuth : false});
        } catch (error) {
            console.log(error);
            set({checkingAuth : false, user : null});
            toast.error(error.response.data.error || error.message)
        }
    }
}))