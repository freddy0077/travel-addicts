'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Layout from './Layout';

interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if current route is an admin route
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // For admin routes, return children without the global Layout wrapper
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  // For all other routes, use the global Layout with navbar and footer
  return <Layout>{children}</Layout>;
}
