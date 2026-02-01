import { Heading } from '@/components/ui/Heading';
import { User } from 'lucide-react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <Heading level={5} className="text-primary font-bold tracking-tight">
        Hold Yourself
      </Heading>
      
      <Link href="/reflect" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform active:scale-95 cursor-pointer hover:bg-primary/20">
        <User className="w-6 h-6" />
      </Link>
    </header>
  );
};
