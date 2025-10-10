"use client";
import Link from "next/link";
import { UserCircleIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import Input from "../ui/componentes/Input";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthError } from "next-auth";
import { loginAction } from "../lib/actions";
import { Lock, Moon, Sun, User } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginPage() {
  /*const router = useRouter();
  const [username, setNombreUsuario] = useState<string>("");
  const [password, setPassUsuario] = useState<string>("");
  const [error, setError] = useState<string | null>(null);*/

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(""); // limpiar antes de nuevo intento

    const responseNextAuth = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    console.log(responseNextAuth);
    if (responseNextAuth?.error) {
      setError("Usuario o contraseña incorrecta");
      return;
    }

    //router.push("/dashboard");
  };

  /*const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(password);
    const responseNextAuth = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      console.log(responseNextAuth.error, responseNextAuth);

      toast.error(responseNextAuth.error, {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    router.push("/dashboard");
    /*try {
    } catch (error) {
      console.log("Salte a error");
      if (error instanceof AuthError) {
        return { error: error.cause?.err?.message };
      }
      return { error: "error 500" };
    }
  };*/

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-blue-600 dark:from-gray-800 dark:to-gray-900 transition-colors">
      <ThemeToggle />
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-400 p-4 rounded-full shadow-md">
            <User className="text-white" size={32} />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-4">
            MEMBER LOGIN
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <span>Remember me</span>
            </label>
            <a
              href="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold shadow-md transition"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}
