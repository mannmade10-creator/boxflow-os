'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MadeRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/')
  }, [])
  return null
}