'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ClassFlowLogin() {
  const router = useRouter()
  useEffect(() => { router.replace('/classflow-login') }, [])
  return null
}
