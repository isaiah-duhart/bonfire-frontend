import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [jwt, setJwt] = useState(null)
  const [userID, setUserID] = useState(null)
  return (
    <AuthContext.Provider value={{ jwt, setJwt, userID, setUserID }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)