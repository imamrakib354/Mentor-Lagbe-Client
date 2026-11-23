import React from 'react';
import { requireRole } from '@/lib/core/server';
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Student Dashboard" }

const StudentDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireRole('student');
    return children;
};

export default StudentDashboardLayout;
