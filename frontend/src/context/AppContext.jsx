import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Create the context
export const AppContext = createContext();

// Define the AppContextProvider component
const AppContextProvider = (props) => { // Include props here

    const currencySymbol = '$' ;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors,setDoctors] = useState([]);

    const [token,setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData,setUserData] = useState(false)
   

    const getDoctorsData = async () => {
        try {
            
            const {data} = await axios.get(backendUrl + '/api/doctor/list')

            if(data.success){

                setDoctors(data.doctors)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")

        }
    }

    const loadUserProfileData = async () => {
        try {

            const {data} = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token }})

            if(data.success){
                setUserData(data.userData)
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    }

    const value = {
        doctors,getDoctorsData,currencySymbol,token,setToken,
        backendUrl,userData,setUserData,loadUserProfileData
    };

    useEffect(()=>{
        getDoctorsData()
    },[])

    useEffect(()=>{

        if(token){
            loadUserProfileData()
        }else{
            setUserData(false)
        }
    },[token])

    return (
        <AppContext.Provider value={value}>
            {props.children} {/* Render child components */}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
