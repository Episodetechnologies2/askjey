"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

    if (status === 'unauthenticated' && !token) {
      router.push('/admin/login');
    } else if (status === 'authenticated' || token) {
      setAuthorized(true);
    }
  }, [status, router]);

  if (status === 'loading' || !authorized) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <div className="text-[#1ebcc7] text-sm uppercase tracking-widest font-semibold flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#1ebcc7] border-t-transparent rounded-full animate-spin" />
          <span>Verifying access...</span>
        </div>
      </div>
    );
  }

  return children;
}
