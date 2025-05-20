"use client";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationLink?: string;
}

export default function VerificationModal({
  isOpen,
  onClose,
  verificationLink,
}: VerificationModalProps) {
  const handleRedirect = () => {
    if (verificationLink) {
      window.open(verificationLink, "_blank");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Verifying your Info...</h2>
        <p className="text-gray-600 mb-6">
          {verificationLink
            ? "The cleaner has been added successfully. Click the button below to complete ID verification."
            : "Once your information is verified the cleaner will be onboarded and provided with login details."}
        </p>
        <button
          onClick={handleRedirect}
          className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          {verificationLink ? "Complete ID Verification" : "Go to Cleaners"}
        </button>
      </div>
    </div>
  );
}
