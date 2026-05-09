'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MedFlowIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/medflow/dashboard');
  }, []);
  return null;
}