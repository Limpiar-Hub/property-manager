interface WalletCardProps {
    balance: string
  }
  
  export default function WalletCard({ balance }: WalletCardProps) {
    return (
      <div className="bg-[#4C41C0] rounded-lg w-[30rem] h-[10rem] mx-auto text-center text-white relative overflow-hidden">
        {/* Wave pattern background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 0 80 C 100 80 100 20 200 20 C 300 20 300 80 400 80 C 500 80 500 20 600 20 C 700 20 700 80 800 80 L 800 400 L 0 400 Z"
              fill="white"
            />
            <path
              d="M 0 100 C 100 100 100 40 200 40 C 300 40 300 100 400 100 C 500 100 500 40 600 40 C 700 40 700 100 800 100 L 800 400 L 0 400 Z"
              fill="white"
              opacity="0.5"
            />
            <path
              d="M 0 120 C 100 120 100 60 200 60 C 300 60 300 120 400 120 C 500 120 500 60 600 60 C 700 60 700 120 800 120 L 800 400 L 0 400 Z"
              fill="white"
              opacity="0.3"
            />
          </svg>
        </div>
  
        <div className="relative z-10">
          <h3 className="text-lg font-medium mb-2">Wallet Balance</h3>
          <p className="text-4xl font-bold">${balance}</p>
        </div>
      </div>
    )
  }
  