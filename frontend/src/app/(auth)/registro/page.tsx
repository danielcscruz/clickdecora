"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function RegistroPage() {
  const router = useRouter();
  const params = useSearchParams();
  const plano = params.get("plano");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setError("");
    try {
      // Register via API route (server-side proxy to backend)
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        if (!r.ok) {
          const e = await r.json();
          throw new Error(e.detail ?? "Erro ao criar conta");
        }
      });

      // Auto-login after register
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) throw new Error("Erro ao fazer login automático");

      router.push(plano ? `/checkout?plano=${plano}` : "/dashboard");
    } catch (e: any) {
      setError(e.message ?? "Erro inesperado. Tente novamente.");
    }
  }

  return (
    <div className="card border border-gold/20">
      <h1 className="font-display text-3xl font-medium text-dark mb-1">Criar conta</h1>
      <p className="font-body text-sm text-dark/50 mb-8">
        {plano
          ? `Crie sua conta para prosseguir com o plano ${plano}.`
          : "Comece sua transformação agora."}
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-body px-4 py-3 rounded-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="font-body text-sm text-dark/70 block mb-1.5">Nome completo</label>
          <input
            type="text"
            autoComplete="name"
            className="input-field"
            placeholder="Seu nome"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="font-body text-sm text-dark/70 block mb-1.5">E-mail</label>
          <input
            type="email"
            autoComplete="email"
            className="input-field"
            placeholder="seu@email.com"
            {...register("email")}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="font-body text-sm text-dark/70 block mb-1.5">Senha</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              className="input-field pr-10"
              placeholder="Mínimo 8 caracteres"
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
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Criar conta"}
        </button>
      </form>

      <p className="font-body text-sm text-center text-dark/50 mt-6">
        Já tem conta?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
