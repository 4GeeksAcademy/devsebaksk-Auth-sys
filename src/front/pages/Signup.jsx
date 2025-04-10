import React, {useState} from 'react'

export const Signup = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

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
            window.location.href="/"

		} catch (error) {
			console.error(error)
		}
	}



    
    return (
        <div>
            <h1>Signup</h1>
            <form>
                <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" onChange={(e)=>{
						setEmail(e.target.value)
					}} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label for="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" onChange={(e)=>{
						setPassword(e.target.value)
					}} className="form-control" id="exampleInputPassword1" />
                </div>
                <button type="button" onClick={handleSignup} className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
