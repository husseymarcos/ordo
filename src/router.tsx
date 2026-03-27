"use client";

import { Routes, Route, Navigate } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";
import { KanbanBoard } from "./components/KanbanBoard";

export function AppRouter() {
  return (
    <>
      <main>
        <Authenticated>
          <KanbanBoard />
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
