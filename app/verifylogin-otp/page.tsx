"use client";

import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import OtpInput from "@/components/otpInput";

export default function Home() {
  return (
    <div className="flex min-h-1/2 mt-10 flex-col w-[30%] xs:w-[50%] sm:w-[50%] mx-auto">
      {/* Desktop Logo */}
      <div className="block mx-auto">
        <Image src="/authLogo.png" alt="logo" width={250} height={130} />
      </div>

      <div className="flex flex-col md:flex-row flex-1 items-center justify-center">
        {/* Main Content */}
        <OtpInput/>
      </div>
    </div>
  );
}
