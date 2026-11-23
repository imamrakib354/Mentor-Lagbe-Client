import React from 'react';
import { requireRole } from '@/lib/core/server';
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Admin Dashboard" }

const AdminDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireRole('admin');
    return children;
};

export default AdminDashboardLayout;
