import axios from "axios";
import React, { ReactNode, useState } from "react";
import { Button } from "../ui/button";

interface ModalProps {
  children: ReactNode;
  userId: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ userId, onClose }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerify = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/auth/verify/${userId}`,
        {
          recievedverification: verificationCode,
        }
      );
      if (response.data.isValid) {
        console.log("verified succesfully");
        onClose();
      } else {
        setErrorMessage("Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-1/4">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="font-bold">Email Verification</h2>
        <p>
          Please verify your email address. Check your inbox for the
          verification email.
        </p>
        <input
          type="text"
          className="border border-gray-300 rounded px-2 py-1 mt-4"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          maxLength={6}
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
          <Button onClick={handleVerify}>Verify</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
