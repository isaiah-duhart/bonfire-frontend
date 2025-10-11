import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { useNavigate, Outlet } from '@tanstack/react-router'

function App() {
  const { jwt } = useAuth()
  const navigate = useNavigate()
  
  useEffect (() => {
    jwt ? navigate({ to: '/groups' }) : navigate({ to: '/landing-page' })
  }, [jwt, navigate])

  console.log("Mounted app")
  return <Outlet />
}

export default App
