import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";


export const Home = () => {



	const { store, dispatch } = useGlobalReducer()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [infoData, setInfoData] = useState()
	const [infoMe, setInfoMe] = useState()
	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	const handleLogin = async()=>{
		const data = {
			"email":email,
			"password":password
		};
		try {
			const response = await fetch (`${import.meta.env.VITE_BACKEND_URL}/login`, {
				method:'POST',
				headers:{
					"Content-Type":"application/json"
				},
				body:JSON.stringify(data)
			});

			if(!response.ok){
				throw new Error("Error login endpoint");
				
			}

			const response_data = await response.json();

			sessionStorage.setItem("access_token", response_data.access_token)
			setInfoData(response_data)


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
			setInfoMe(data)

		}catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
	
	}, [])

	return (
		<div className="text-center mt-5">
			<Link to="/signup">
        	<button className="btn btn-primary">Signup</button>
      		</Link>
			<form>
				<div className="mb-3">
					<label for="exampleInputEmail1" className="form-label">Email address</label>
					<input type="email" onChange={(e)=>{
						setEmail(e.target.value)
					}} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
						<div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
				</div>
				<div className="mb-3">
					<label for="exampleInputPassword1" className="form-label">Password</label>
					<input type="password" onChange={(e)=>{
						setPassword(e.target.value)
					}} className="form-control" id="exampleInputPassword1"/>
				</div>
				<button type="button"  onClick={handleLogin} className="btn btn-primary">Login</button>
			</form>
		</div>
	);
}; 