import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";
import './Css/login.scss'

export const Login = () => {


	const navigate = useNavigate()
	const { store, dispatch } = useGlobalReducer()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [infoData, setInfoData] = useState()
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

	const handleLogin = async () => {
		const data = {
			"email": email,
			"password": password
		};
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				throw new Error("Error login endpoint");

			}

			const response_data = await response.json();

			sessionStorage.setItem("access_token", response_data.access_token)
			setInfoData(response_data)

			navigate("/private")

		} catch (error) {
			console.error(error)
		}
	}




	useEffect(() => {

	}, [])

	return (
		<div className="wrapper">
			
			<form>
				<h1>Login</h1>
				<div className="input-box">
					<input 
					type="email" placeholder="Email" required
					onChange={(e) => {
						setEmail(e.target.value)
					}}
					className="form-control" id="InputEmail1" aria-describedby="emailHelp"
					/>
					<i className="fa-solid fa-user icon"/>
				</div>
				<div className="input-box">
					<input type="password" placeholder="Password" required 
					onChange={(e) => {
						setPassword(e.target.value)
					}}
					className="form-control" id="exampleInputPassword1" />
					<i className="fa-solid fa-lock icon"/>
				</div>
				<div className="remember-forgot">
					<label><input type="checkbox"/> Remember me</label>
				</div>
				<div className="buttons">
				<button type="button" onClick={handleLogin} className="login">Login</button>

				<Link to="/signup">
				<div className="register-link">
				<button className="signup">Signup</button>
				</div>
				
			</Link>
			</div>
			</form>
		</div>
	);
}; 