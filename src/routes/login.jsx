import { createFileRoute } from '@tanstack/react-router'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config'

import '../index.css'
import '../app.css'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

export default function LoginPage() {
    const { setJwt } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
        const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
        throw new Error('Login failed')
        }

        return response.json()
    },
    onSuccess: (data) => {
        setJwt(data.token)
    },
    onError: (error) => {
        setError(error.message)
    },
    })

    const createAccountMutation = useMutation({
    mutationFn: async ({ email, password }) => {
        let response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
        throw new Error('Create account failed')
        }

        response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
        throw new Error('Login failed')
        }

        return response.json()
    },
    onSuccess: (data) => {
        setJwt(data.token)
    },
    onError: (error) => {
        setError(error.message)
    },
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        loginMutation.mutate({ email, password })
    }

    const handleCreateAccount = async (e) => {
        e.preventDefault()
        setError(null)
        createAccountMutation.mutate({ email, password })
    }

    return (
        <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
            <label>Email:</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Password:</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>
        <button type="submit">Log In</button>
        <button type="button" onClick={handleCreateAccount}>Create Account</button>
        </form>
    )
}