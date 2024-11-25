'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskBoard from '@/components/TaskBoard';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function TaskPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return null; // or a loading state
  }

  return (
    <div className="p-4">
      <TaskBoard 
        teamId="team-1"
        currentUser={{ id: user.id, name: user.name || "Unknown User" }} // Fallback for name
      />
    </div>
  );
}
