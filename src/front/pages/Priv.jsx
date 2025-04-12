import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import './Css/priv.scss'

export const Priv = () => {

    const navigate = useNavigate()
    const [infoMe, setInfoMe] = useState()

    const handleLogout = async()=>{

		try {
			const response = await fetch (`${import.meta.env.VITE_BACKEND_URL}/logout`, {
				method:'POST',
				headers:{
					"Content-Type":"application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('access_token')}`
				}
			});
			if(!response.ok){
				throw new Error("Error logout endpoint");
				
			}

			const responseData = await response.json();

			console.log(responseData)

            sessionStorage.removeItem('access_token')

			navigate("/")

		} catch (error) {
			console.error(error)
		}
	}

    
    const handleMe = async()=>{
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/me`,{
                    method:'GET',
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem('access_token')}`
                    }
                    });
    
                const data = await response.json()
                setInfoMe(data.email)
                console.log(setInfoMe)
    
            }catch (error) {
                console.log(error)
            }
        }

    const validationToken = ()=>{
        if(sessionStorage.getItem('access_token')===null){
            return navigate("/")
        }
    }

        useEffect(() => {
            validationToken()
            handleMe()
            }, [])

  return (
    <div className="wrapper-priv">
        <div className="header-button">
        <button type="button"   onClick={handleLogout}>Logout</button>
        </div>
        <div>
        <h1>Bienvenido {infoMe}</h1>
        </div>
    </div>
  )
}
