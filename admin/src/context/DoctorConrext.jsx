import { createContext, useState } from "react";
import axios from "axios";
import {toast} from 'react-toastify'

export const DoctorContext = createContext();

const DoctorContextProvider = (props) =>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken,setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):"")
    const [dashData,setDashData] = useState(false);
    const [profileData,setProfileData] = useState(false);


    const [appoinments,setAppointments] = useState([]);

    const getAppoinments = async() =>{
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/appointments',{headers:{dToken}})

            if(data.success){
                setAppointments(data.appoinments)
                console.log(data.appoinments);
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
            
        }
    }

    const completeAppoinment = async(appointmentId) =>{

        try {

            const {data} = await axios.post(backendUrl + '/api/doctor/complete-appointment',{appointmentId},{headers:{dToken}})

            if(data.success){
                toast.success(data.message) 
                getAppoinments()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    }




    const cancelAppoinment = async(appointmentId) =>{

        try {

            const {data} = await axios.post(backendUrl + '/api/doctor/cancel-appointment',{appointmentId},{headers:{dToken}})

            if(data.success){
                toast.success(data.message) 
                getAppoinments()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    }

    const getDashData = async() =>{

        try {

            const {data} = await axios.get(backendUrl + '/api/doctor/dashboard',{headers:{dToken}})

            if(data.success){
                setDashData(data.dashData)
                console.log(data.dashData);
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    }


    const getProfileData = async() =>{

        try {

            const {data} = await axios.get(backendUrl + '/api/doctor/profile',{headers:{dToken}})

            if(data.success){
                setProfileData(data.profileData)
                console.log(data.profileData);
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    }



    const value = {
        dToken,
        setDToken,backendUrl,appoinments,setAppointments,getAppoinments,completeAppoinment,cancelAppoinment,
        dashData,setDashData,getDashData,profileData,setProfileData,getProfileData
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider