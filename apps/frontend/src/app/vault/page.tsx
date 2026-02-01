'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PageContainer } from '@/components/layout/PageContainer';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Aura } from '@/components/ui/Aura';
import { Shield } from 'lucide-react';

export default function VaultPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-8">
        <div className="relative">
          <Aura color="#F472B6" size={280} className="mb-4" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-32 h-32 rounded-full glass flex items-center justify-center">
                <Shield className="w-12 h-12 text-[#F472B6]/40" />
             </div>
          </div>
        </div>

        <div className="space-y-4 max-w-sm">
          <Heading level={3}>Your Private Vault.</Heading>
          <Text size="lg" muted>
            A strictly private space for your raw thoughts and mood history. (Coming Soon)
          </Text>
        </div>
      </div>
    </PageContainer>
  );
}
