import { Heading } from '@/components/ui/Heading';
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export const Header: React.FC = () => {
  const { logout } = useAuth();
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <Heading level={5} className="text-primary font-bold tracking-tight">
        Hold Yourself
      </Heading>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={logout}
          className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
        <Link href="/reflect" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform active:scale-95 cursor-pointer hover:bg-primary/20">
          <User className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
};
