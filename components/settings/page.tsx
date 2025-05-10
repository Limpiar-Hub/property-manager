"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Building,
  MessageCircle,
  Activity,
  Calendar,
  CreditCard,
  Headphones,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/hooks/useReduxHooks"

import { useRouter } from "next/navigation";
import { logout } from "@/redux/features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setIsOpen } from "@/redux/features/user/userSlice";
import { setTheme, setShowBalance } from "@/redux/features/user/userSlice";
import { ArrowRight } from "lucide-react";

export default function Settings() {
  const pathname = usePathname();
  const {isOpen, theme, showBalance} = useSelector((state: RootState) => state.user);



  const dispatch = useAppDispatch();
  const router = useRouter();
 

  const handleLightTheme = () => {
    dispatch(setTheme("light"));
  }
  const handleDarkTheme = () => {
      dispatch(setTheme("dark"));
  };

  const toggleSwitch = () => {
    dispatch(setShowBalance(!showBalance));
  }

  return (
    <>
    {isOpen && (
        <div
          className="absolute top-16 right-4 w-72 h-[80vh] bg-white border-2 dark:bg-black rounded-lg shadow-lg pb-4 transition-all duration-500 ease-in-out animate-dropdown"
        >
          <div>
            <button
            className="p-3 rounded-full"
            onClick={() => dispatch(setIsOpen(!isOpen))}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          <div className='flex-col border-color ml-2'>
            <div>
              <p className='font-semibold text-lg border-b-2'>Theme Settings</p>
              <div className="mt-3">
                <div className='mt-1'>
                  <input 
                    type='radio'
                    id='light'
                    name='theme'
                    value='Light'
                    className='cursor-pointer'
                    onChange={handleLightTheme}
                    checked={theme ==='light'}
                  />
                  <label htmlFor='light' className='ml-2 text-md cursor-pointer'>
                    Light
                  </label>
                </div>

                <div className='mt-1'>
                  <input 
                    type='radio'
                    id='dark'
                    name='theme'
                    value='Dark'
                    className='cursor-pointer'
                    onChange={handleDarkTheme}
                    checked={theme === "dark"}
                  />
                  <label htmlFor='dark' className='ml-2 text-md cursor-pointer'>
                    Dark
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <p className='font-semibold text-lg border-b-2'>Password Settings</p>

              <div className="mt-3">
                <button className="flex justify-between mb-2" onClick={() => router.push("/forgot-password")}>
                  <span>Reset Password</span>
                  <span> <ArrowRight size={18} className="mr-1"/> </span>
                </button>

                <div className="flex justify-between" onClick={() => router.push("/change-password")}>
                  <span>Change Password</span>
                  <span> <ArrowRight size={18} className="mr-1"/> </span>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <p className='font-semibold text-lg border-b-2'>Security Settings</p>

              <div className="flex items-center justify-between mt-3">
                <span className="text-base">Show Balance:</span>
                <div
                  onClick={toggleSwitch}
                  className={`relative inline-flex items-center cursor-pointer ${showBalance ? 'bg-blue-600' : 'bg-gray-300'} rounded-full w-12 h-6`}
                >
                  {/* Circle inside the switch */}
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out ${showBalance ? 'transform translate-x-6' : ''}`}
                  />
                </div>
                <span className="text-lg font-medium">{showBalance ? "On" : "Off"}</span>
              </div>
            </div>
          </div>
        </div>
    )}
  </>
  
  );
}
