"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Loader from "@/components/Loader";


interface UserProfile {
  id?: string;  //newly added
  name?: string;
  email?: string;
  gender?: string;
  phone?: string;
  profile_picture: string | File | null;
}

interface AppUtilsType {
    isLoggedIn: boolean;
    setIsLoggedIn: (state: boolean)=> void;
    authToken: string | null;
    setAuthToken: (state: string | null)=> void;
    userProfile: UserProfile | null;
    setUserProfile: (state: UserProfile | null) => void;
    setIsLoading: (state: boolean) => void;

}


const AppUtilsContext = createContext<AppUtilsType | undefined>(undefined);
export const AppUtilsProvider = ({
  Children,
}: {
  Children: React.ReactNode;
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 
    const [authToken , setAuthToken] = useState<null | string>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=> {
      const token = localStorage.getItem("access_token");
      const userProfile = localStorage.getItem("user_profile");
      if (token) {
        setAuthToken(token);
        setIsLoggedIn(true);
        setUserProfile(userProfile ? JSON.parse(userProfile) : null);
      } 
    }, []);

  return (
   <AppUtilsContext.Provider 
   value={{ 
    isLoggedIn,
    authToken,
   setAuthToken, 
   setIsLoggedIn, 
   userProfile, 
   setUserProfile,
   setIsLoading,
    }}
    >
    {isLoading ? <Loader /> : Children}
   </AppUtilsContext.Provider>
  )
};

export const useMyAppHook = () => {
    const context = useContext(AppUtilsContext);
    if(!context) {
        throw new Error ("AppUtils functions must be wrapped in AppUtilsprovider");
    }
    return context;
}

