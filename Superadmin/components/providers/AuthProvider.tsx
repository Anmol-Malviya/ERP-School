'use client';
import {useState} from 'react';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {AuthStateProvider} from '@/hooks/useAuth';

export function AuthProvider({children}:{children:React.ReactNode}){
  const[queryClient]=useState(()=>new QueryClient({
    defaultOptions:{
      queries:{staleTime:30_000,retry:1,refetchOnWindowFocus:false},
      mutations:{retry:0}
    }
  }));
  return <QueryClientProvider client={queryClient}><AuthStateProvider>{children}</AuthStateProvider></QueryClientProvider>;
}
