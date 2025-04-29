'use client';

import Image from "next/image";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/hooks/useReduxHooks";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<any>(null);
  const [userWallet, setUserWallet] = useState<any>(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: ""
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedAuth = localStorage.getItem("persist:auth");
        if (storedAuth) {
          const parsedUser = JSON.parse(JSON.parse(storedAuth).user);
          setUser(parsedUser);
          setFormData({
            fullName: parsedUser.fullName || "",
            email: parsedUser.email || "",
            phoneNumber: parsedUser.phoneNumber || ""
          });
        }

        const walletData = localStorage.getItem("userWallet");
        if (walletData) {
          setUserWallet(JSON.parse(walletData).data.wallet);
        }
      } catch (error) {
        console.error("Error parsing user or wallet data:", error);
      }
    }
  }, []);

  const wallet = userWallet?.balance || 0;

  const handleLogout = () => {
    setConfirmationModal(false);
    dispatch(logout());
    router.push("/login");
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    const stored = localStorage.getItem("persist:auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      localStorage.setItem(
        "persist:auth",
        JSON.stringify({ ...parsed, user: JSON.stringify(updatedUser) })
      );
    }
    setEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50">
      <div className="content min-w-[50%]">
        <div className="relative top-4">
          <button className="flex items-center text-gray-600 w-20 h-11 hover:text-gray-900" onClick={() => router.back()}>
            <ArrowLeft size={18} className="mr-1" />
            <p>Back</p>
          </button>
        </div>

        <div className="relative flex flex-col items-center mt-6">
          <div className="relative rounded-full overflow-hidden w-32 h-32">
          <Image
  src={user?.profileImage?.trim() ? user.profileImage : "https://t4.ftcdn.net/jpg/04/83/90/95/360_F_483909569_OI4LKNeFgHwvvVju60fejLd9gj43dIcd.jpg"}
  alt="User Profile"
  width={200}
  height={200}
  className="object-cover w-full h-full"
/>

          </div>
          <div className="relative flex flex-col justify-center text-center mt-4">
            <h1 className="text-2xl font-bold">{user?.fullName}</h1>
            <p className="text-gray-500">{user?.role}</p>
          </div>
        </div>

        <div className="relative w-full mt-7 p-5 rounded-lg bg-white shadow-md border-2 border-gray-200">
          <ul className="text-gray-700 text-base space-y-5">
            {["fullName", "email", "phoneNumber"].map((key) => (
              <li key={key} className="flex justify-between items-center">
                <span className="capitalize">{key.replace("Number", " Number")}</span>
                {editMode ? (
  <input
    type="text"
    name={key}
    value={(formData as any)[key]}
    readOnly
    className="border rounded px-2 py-1 w-1/2 bg-gray-100 text-gray-400 cursor-not-allowed"
  />
) : (
  <span>{(user as any)?.[key]}</span>
)}

              </li>
            ))}

            <li className="flex justify-between">
              <span>Email Verified</span>
              <span>{user?.isVerified ? "Yes" : "No"}</span>
            </li>

            <li className="flex justify-between">
              <span>Creation Date</span>
              <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</span>
            </li>

            <li className="flex justify-between">
              <span>Wallet Balance</span>
              <span className="font-semibold">${wallet.toLocaleString()}</span>
            </li>

            <li
              className="flex justify-between items-center font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => setEditMode(!editMode)}
            >
              <span>{editMode ? "Cancel Edit" : "Edit Profile"}</span>
              <ArrowRight size={18} />
            </li>

            {editMode && (
              <li className="flex justify-center">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </li>
            )}

            <li className="mx-auto font-semibold text-base text-red-700 text-center">
              <button className="hover:text-red-900" onClick={() => setConfirmationModal(true)}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Logout Modal */}
      {confirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Are you sure you want to logout?</h2>
            <div className="flex justify-center gap-4">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700" onClick={handleLogout}>
                Yes, Logout
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                onClick={() => setConfirmationModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
