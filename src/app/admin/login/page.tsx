"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@perusahaan.co.id");
  const [password, setPassword] = useState("AdminCorporate2026!");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Email atau password tidak sesuai");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal masuk ke sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-corporate-navy-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C8A96B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-corporate-navy via-corporate-navy to-corporate-blue p-8 text-center text-white space-y-2">
          <div className="w-12 h-12 rounded-xl bg-corporate-blue border border-corporate-gold/40 flex items-center justify-center mx-auto text-corporate-gold shadow-gold">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Administrator CMS Portal
          </h1>
          <p className="text-xs text-gray-300">
            Sistem Manajemen Konten & Pengelolaan RFQ Terpadu
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="bg-corporate-gold-light/60 p-3 rounded-lg border border-corporate-gold/30 text-[11px] text-corporate-navy space-y-1">
            <p className="font-semibold text-corporate-gold-hover flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Akun Default Administrator (Seed Demo):
            </p>
            <p>
              Email: <code className="font-mono bg-white px-1.5 py-0.5 rounded">admin@perusahaan.co.id</code>
            </p>
            <p>
              Password: <code className="font-mono bg-white px-1.5 py-0.5 rounded">AdminCorporate2026!</code>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Administrator"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@perusahaan.co.id"
            />

            <Input
              label="Kata Sandi (Password)"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold uppercase tracking-wider text-xs shadow-corporate mt-2"
            >
              <Lock className="w-4 h-4 mr-2" />
              Masuk ke Dashboard Admin
            </Button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-center">
            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-corporate-navy inline-flex items-center gap-1 font-medium"
            >
              &larr; Kembali ke Website Publik
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

