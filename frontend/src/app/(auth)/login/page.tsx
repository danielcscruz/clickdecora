"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setError("E-mail ou senha incorretos.");
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div className="card border border-gold/20">
      <h1 className="font-display text-3xl font-medium text-dark mb-1">Entrar</h1>
      <p className="font-body text-sm text-dark/50 mb-8">
        Acesse sua área para acompanhar seu projeto.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-body px-4 py-3 rounded-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="font-body text-sm text-dark/70 block mb-1.5">E-mail</label>
          <input
            type="email"
            autoComplete="email"
            className="input-field"
            placeholder="seu@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="font-body text-sm text-dark/70 block mb-1.5">Senha</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              className="input-field pr-10"
              placeholder="••••••••"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark/70"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Entrar"}
        </button>
      </form>

      <p className="font-body text-sm text-center text-dark/50 mt-6">
        Não tem conta?{" "}
        <Link href="/registro" className="text-primary hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
