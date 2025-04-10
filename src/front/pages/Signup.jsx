import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
import './Css/login.scss'

export const Signup = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
	const [reEnteredpassword, setReEnteredPassword] = useState("")

    const handleSignup = async()=>{
		const data = {
			"email":email,
			"password":password
		};
		try {
			const response = await fetch (`${import.meta.env.VITE_BACKEND_URL}/users`, {
				method:'POST',
				headers:{
					"Content-Type":"application/json"
				},
				body:JSON.stringify(data)
			});

			if(!response.ok){
				throw new Error("Error login endpoint");
				
			}
            navigate("/")

		} catch (error) {
			console.error(error)
		}
	}



    
    return (
		<body>
        <div className='wrapper'>
            <h1>Signup</h1>
            <form>
                <div className="input-box">
                    <input type="email" onChange={(e)=>{
						setEmail(e.target.value)
					}} className="form-control"  id="InputEmail" placeholder="Email"/>
                </div>
                <div className="input-box">
                    <input type="password" onChange={(e)=>{
						setPassword(e.target.value)
					}} className="form-control" id="InputPassword" placeholder="Password"/>
                </div>
				<div className="input-box">
                    <input type="password" onChange={(e)=>{
						setReEnteredPassword(e.target.value)
					}} className="form-control" id="InputReEnteredPassword1" placeholder="Re-enter password"/>
                </div>
				<div className='buttons'>
                <button type="button" onClick={handleSignup} className="signup">Submit</button>
				</div>
            </form>
        </div>
		</body>
    )
}
