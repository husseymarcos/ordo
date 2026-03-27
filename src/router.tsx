"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";

export function AppRouter() {
  return (
    <>
      <main>
        <Authenticated>
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p>Welcome! You are authenticated.</p>
          </div>
        </Authenticated>
        <Unauthenticated>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Unauthenticated>
      </main>
    </>
  );
}
