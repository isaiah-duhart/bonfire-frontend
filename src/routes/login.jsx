import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { API_URL } from '../config'
import { useAuth } from '../context/AuthContext'

import img from '../assets/bonfire.jpg'
import '../styles/index.css'

export const Route = createFileRoute('/login')({
	component: LoginPage,
})

function LoginPage() {
	const { setJwt, setUserID } = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)

	console.log(`api url is ${API_URL}`)

	const loginMutation = useMutation({
		mutationFn: async ({ email, password }) => {
			const response = await fetch(`${API_URL}/api/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			})

			if (!response.ok) {
				setError(response.body)
			}

			return response.json()
		},
		onSuccess: (data) => {
			console.log(data)
			setJwt(data.token)
			setUserID(data.user_id)
		},
		onError: (error) => setError(error),
	})

	const handleLogin = (e) => {
		e.preventDefault()
		setError(null)
		loginMutation.mutate({ email, password })
	}

	if (error) return <p style={{ color: 'red' }}>{error.message}</p>

	return (
		<div className='main'>
			<div className='picture-container'>
				<img src={img} alt='Picture of cherry blossom trees' id='picture' />
				<p id='title'>Bonfire</p>
				<p id='attribution'>
					Photo by{' '}
					<a href='https://unsplash.com/@chuttersnap?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'>
						CHUTTERSNAP
					</a>{' '}
					on{' '}
					<a href='https://unsplash.com/photos/photography-of-burning-camp-fire-rLm4Wq96h_0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash'>
						Unsplash
					</a>
				</p>
			</div>
			<div className='form-container'>
				<form onSubmit={handleLogin} className='sign-up'>
					<section className='form-header'>Log In</section>
					<section className='form-body'>
						<div className='input-line'>
							<div className='input-bundle'>
								<label>EMAIL</label>
								<input
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div className='input-bundle'>
								<label>PASSWORD</label>
								<input
									type='password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
						</div>
					</section>
					<section className='form-submit'>
						<button className='submit'>Log In</button>
						<p className='already-exists'>
							Don't have an account?{' '}
							<Link to='/landing-page' className='login'>
								Create an account
							</Link>
						</p>
					</section>
				</form>
			</div>
		</div>
	)
}
