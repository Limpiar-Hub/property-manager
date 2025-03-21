"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks" 
import { setPhone } from "@/redux/features/login/loginSlice";
import { setOtp } from "@/redux/features/login/loginSlice";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"
import Spinner from "./spinner";

export default function LoginForm() {
    const dispatch = useAppDispatch()
    
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    const handleEmail = (e) => {
        const value = e.target.value;
        setEmail(value)
    }

    const handlePassword = (e) => {
        const value = e.target.value;
        setPassword(value);
    }

    const handleLoginFunction = () => {
        if (email === 'owoyeminiyi2@gmail.com' && password === "N123456"){
            return true
        } else {
            return false
        }
    }

    const LoginFunc = () => {
        setIsLoading(true);

        setTimeout(() => {
            const response = handleLoginFunction();
    
            response ? router.push('/verifylogin-otp') : alert('incorrect email or password');

            dispatch(setPhone(+2349128943518));

            dispatch(setOtp(Math.floor(100000 + Math.random() * 900000)));

            setIsLoading(false);
        }, 4000);
    }

  return (
    <div className="relative flex-1 p-6 md:p-10 flex flex-col w-[50%]">
        <div className="items-start flex flex-col justify-baseline">
            <h1 className="font-medium text-4xl pb-6">Sign In</h1>
            <div className="w-full space-y-4">
                <div className="space-y-1">
                    <label htmlFor='email' className="block text-base font-medium">
                        Email Address
                    </label>
                    <div className="relative">
                        <input
                        id='email'
                        type='email'
                        onChange={handleEmail}
                        placeholder='hello@email.com'
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e7eea] focus:border-transparent pr-10`}
                        />
                    </div>
                </div>
                <div className="space-y-1">
                      <label htmlFor='password' className="block text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id='password'
                          onChange={handlePassword}
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2e7eea] focus:border-transparent pr-10`}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div>
                    <input type="checkbox" id="keep me signed in" name="keep me signed in" value="keep me signed in" /> 
                    <label htmlFor="keep me signed in" className=" text-sm"> Keep me signed in</label>

                    <a className="pl-20 text-sm underline text-blue-600 hover:text-blue-800 visited:text-purple-600 cursor-pointer">Forgot Password?</a>
                </div>
                <button
                    type="button" onClick={() => LoginFunc()}
                    className="relative bg-[#0082ED] w-full h-10 top-1/2 mt-14 text-white rounded-md"
                    disabled={isLoading}
                    >
                        {isLoading ? <Spinner /> : "Next"}
                </button>
                <span className="items-center flex justify-center">If you don't have an account <a className="pl-2 underline text-blue-600 hover:text-blue-800 visited:text-purple-600 cursor-pointer"> Sign Up</a></span>
            </div>
        </div>
    </div>
  );
}
