'use client';import {AuthStateProvider} from '@/hooks/useAuth';export function AuthProvider({children}:{children:React.ReactNode}){return <AuthStateProvider>{children}</AuthStateProvider>}
