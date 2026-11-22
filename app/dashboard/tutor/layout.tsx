import React from 'react';
import { requireRole } from '@/lib/core/server';

const TutorDashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireRole('tutor');
    return children;
};

export default TutorDashboardLayout;