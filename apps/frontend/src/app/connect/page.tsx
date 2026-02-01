'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PageContainer } from '@/components/layout/PageContainer';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Aura } from '@/components/ui/Aura';
import { Users } from 'lucide-react';

export default function ConnectPage() {
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
          <Aura color="#34D399" size={280} className="mb-4" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-32 h-32 rounded-full glass flex items-center justify-center">
                <Users className="w-12 h-12 text-[#34D399]/40" />
             </div>
          </div>
        </div>

        <div className="space-y-4 max-w-sm">
          <Heading level={3}>Connect with Circles.</Heading>
          <Text size="lg" muted>
            Join small, safe groups for anonymous support and deep sharing. (Coming Soon)
          </Text>
        </div>
      </div>
    </PageContainer>
  );
}
