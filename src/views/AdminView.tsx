"use client";

import React from "react";
import { useAuth } from "@/lib/auth";
import { AdminLogin } from "./admin/AdminLogin";
import { AdminDashboard } from "./admin/AdminDashboard";

export function AdminView() {
  const { session, loading } = useAuth();
  if (loading) return null;
  return session ? <AdminDashboard /> : <AdminLogin />;
}
