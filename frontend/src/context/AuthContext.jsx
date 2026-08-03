// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import api from "@/lib/api";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const res = await api.get("/auth/me");

//         console.log("ME API RESPONSE:", res.data);

//         setUser(res.data.data);
//       } catch (error) {
//         console.log("ME API ERROR:", error.response?.data);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   const signup = async ({ name, email, password }) => {
//     const res = await api.post("/auth/register", {
//       name,
//       email,
//       password,
//     });

//     setUser(res.data.data);
//     return res.data.data;
//   };

//   const login = async ({ email, password }) => {
//     const res = await api.post("/auth/login", {
//       email,
//       password,
//     });

//     setUser(res.data.data);
//     return res.data.data;
//   };

//   const logout = async () => {
//     await api.post("/auth/logout");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         signup,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);

//   if (!ctx) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }

//   return ctx;
// }




"use client"

import {createContext, useContext, useEffect, useState} from 'react'
import api from "@/lib/api"

const AuthContext = createContext(null)

export function AuthProvider({children}){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/auth/me")
        setUser(res.data.data.user)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const signup = async ({name, email, password}) => {
    const res = await api.post("/auth/register", {name, email, password})
    setUser(res.data.data.user)
    return res.data.data.user
  }

  const login = async ({email, password}) => {
    const res = await api.post("/auth/login", {email, password})
    setUser(res.data.data.user);
    return res.data.data.user;
  }

  const logout = async () => {
    await api.post("/auth/logout")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{user, loading, signup, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth () {
  const ctx = useContext(AuthContext)
  if(!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}