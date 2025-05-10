'use client'

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxHooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setIsOpen, setOpenProfile } from "@/redux/features/user/userSlice";
import {Menu, X} from "lucide-react";

// app/profile/page.tsx
export default function ProfilePage() {  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {isProfileOpen} = useSelector((state: RootState) => state.user);

  const getuser = localStorage.getItem('persist:auth');
  let user: any;
  if(getuser) {
    user = JSON.parse(JSON.parse(getuser).user);
  }

  const getuserBalance = localStorage.getItem('userWallet');
  let userWallet: any
  if(getuserBalance) {
    userWallet = JSON.parse(getuserBalance).data.wallet;
  }
  const wallet = userWallet.balance;

  const getTotalProperty = localStorage.getItem('totalProperty');
  let totalProperty: any;
  if(getTotalProperty) {
    totalProperty = JSON.parse(getTotalProperty);
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login"); // Redirect to login page after logout
  };

  const { userBalance } = useAppSelector((state) => state.topUpModal);
    return (
      <>
      {isProfileOpen && (
      <div className="absolute top-16 right-4 w-96 h-[80vh] overflow-auto bg-white border-2 dark:bg-black rounded-lg shadow-lg transition-all duration-500 ease-in-out animate-dropdown">
        <div>
          <div>
            <button
            className="p-3 rounded-full"
            onClick={() => dispatch(setOpenProfile(!isProfileOpen))}
            >
              {isProfileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <div className="relative flex flex-col items-center rounded-lg ">
              <Image src="/darren.png" alt='Property image' width={200} height={200} className="relative object-cover" />
              <div className="relative flex flex-col justify-center">
                  <h1 className="text-2xl font-bold">{user.fullName}</h1>
                  <p className="text-gray-500">{user.role}</p>
              </div>
          </div>

          <div className="relative w-[100%] mt-7 p-5 rounded-lg items-start border-2">
            <div>
              <ul className="list-inside text-base text-start space-y-5">
                  <li className="flex justify-between">
                  <span>Full Name</span>
                  <span>{user.fullName}</span>
                </li>

                <li className="flex justify-between">
                  <span>Email Verified</span>
                  <span>{user.isVerified ? user.isVerified : 'false'}</span>
                </li>

                <li className="flex justify-between">
                  <span>Email</span>
                  <span>{user.email}</span>
                </li>

                <li className="flex justify-between">
                  <span>Phone</span>
                  <span>{user.phoneNumber}</span>
                </li>

                <li className="flex justify-between">
                  <span>Creation date</span>
                  <span>{new Date(user.createdAt).toDateString()}
                  </span>
                </li>

                <li className="flex justify-between">
                  <span>Wallet Balnace</span>
                  <span>${wallet.toLocaleString()}</span>
                </li>

                {user.role === 'property_manager' && 
                  <li className="flex justify-between">
                    <span>Total Property</span>
                    <span>{totalProperty}</span>
                  </li>
                }

                <li className="flex justify-between font-bold">
                  <span>Edit Profile</span>
                  <span> <ArrowRight size={18} className="mr-1" /> </span>
                </li>

                <li className="flex justify-between font-bold">
                  <span>Settings</span>
                  <span> <ArrowRight size={18} className="mr-1" /> </span>
                </li>

                <li className="mx-auto font-semibold text-base text-red-700 text-center">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
    
    );
  }
  