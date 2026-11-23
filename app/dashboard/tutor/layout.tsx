import React from 'react';
import { requireRole } from '@/lib/core/server';
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Tutor Dashboard" }

const TutorDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireRole('tutor');
    return children;
};

export default TutorDashboardLayout;
