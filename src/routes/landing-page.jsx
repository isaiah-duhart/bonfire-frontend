import { createFileRoute, Link } from '@tanstack/react-router'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config'
import img from '../assets/bonfire.jpg'

import '../index.css'

export const Route = createFileRoute('/landing-page')({
	component: LandingPage,
})

export default function LandingPage() {
	const { setJwt, setUserID } = useAuth()
	const [error, setError] = useState(null)

	const createAccountMutation = useMutation({
		mutationFn: async ({ name, birthday, email, password }) => {
			let response = await fetch(`/api/users`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, birthday, email, password }),
			})

			if (!response.ok) {
				throw new Error('Create account failed')
			}

			return response.json()
		},
		onSuccess: (data) => {
			setJwt(data.token)
			console.log(data.user_id)
			setUserID(data.user_id)
		},
		onError: (error) => {
			setError(error.message)
		},
	})

	const handleCreateAccount = async (e) => {
		e.preventDefault()
		setError(null)
		const formData = new FormData(e.target)
		const name = `${formData.get('first_name')} ${formData.get('last_name')}`
		if (formData.get('password') != formData.get('confirm_password')) {
			setError(new Error("passwords don't match"))
			return
		}
		createAccountMutation.mutate({
			name,
			birthday: formData.get('birthday'),
			email: formData.get('email'),
			password: formData.get('password'),
		})
	}

	if (error) return <p>Error {error.message}</p>

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
				<form onSubmit={handleCreateAccount} className='sign-up'>
					<section className='form-header'>
						Sign up for Bonfire now and take your relationships to the next
						level!
						<p>
							Sign up <em>now</em> to get started.
						</p>
					</section>
					<section className='form-body'>
						<p>Let's do this!</p>
						<div className='input-line'>
							<div className='input-bundle'>
								<label>FIRST NAME</label>
								<input type='text' id='first_name' name='first_name' required />
							</div>
							<div className='input-bundle'>
								<label>LAST NAME</label>
								<input type='text' id='last_name' name='last_name' required />
							</div>
						</div>
						<div className='input-line'>
							<div className='input-bundle'>
								<label>EMAIL</label>
								<input type='email' id='email' name='email' required />
							</div>
							<div className='input-bundle'>
								<label>BIRTHDAY</label>
								<input
									type='text'
									minLength='10'
									maxLength='10'
									id='birthday'
									placeholder='yyyy-mm-dd'
									name='birthday'
									required
								/>
							</div>
						</div>
						<div className='input-line'>
							<div className='input-bundle'>
								<label id='password'>PASSWORD</label>
								<input
									type='text'
									// minLength='8'
									maxLength='255'
									id='password'
									name='password'
									required
								/>
							</div>
							<div className='input-bundle'>
								<span>CONFIRM PASSWORD</span>
								<input
									type='text'
									// minLength='8'
									maxLength='255'
									id='confirm_password'
									name='confirm_password'
									required
								/>
							</div>
						</div>
					</section>
					<section className='form-submit'>
						<button className='submit'>Create Account</button>
						<p className='already-exists'>
							Aready have an account?{' '}
							<Link to='/login' className='login'>
								Log in
							</Link>
						</p>
					</section>
				</form>
			</div>
		</div>
	)
}
