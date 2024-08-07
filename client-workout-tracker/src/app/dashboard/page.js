// src/app/dashboard/page.js
'use client';

import React from 'react';
import useAuth from '@/components/hooks/useAuth';
import ContentArea from '@/components/component/dahsboard-main';

export default function Home() {
  useAuth(); // Ensure user authentication

  return (
    <>
      <ContentArea />
    </>
  );
}
