"use client";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    login("fake-jwt-token");
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Mock Login
      </button>
    </div>
  );
}
