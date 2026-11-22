import React from 'react';
import { requireRole } from '@/lib/core/server';

const StudentDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireRole('student');
    return children;
};

export default StudentDashboardLayout;