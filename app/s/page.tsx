// app/s/page.tsx
'use client';
import { useState, useEffect } from 'react';
import TaskBoard from '@/components/TaskBoard';
import TeamSidebar from '@/components/TeamSidebar';
import { teamService } from '@/lib/firebase/teamService';
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function TaskPage() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<{ teamId: string; name: string }[]>([]);


  // Effect for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Effect for team subscription
  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = teamService.subscribeToUserTeams(user.uid, (userTeams) => {
      setTeams(userTeams);
      if (userTeams.length > 0 && !selectedTeamId) {
        setSelectedTeamId(userTeams[0].teamId);
      }
    });
    

    return () => unsubscribe();
  }, [user, selectedTeamId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <TeamSidebar
        currentUser={{
          id: user.uid,
          name: user.displayName || 'Anonymous',
          email: user.email || '',
        }}
        onTeamSelect={setSelectedTeamId}
        selectedTeamId={selectedTeamId || undefined}
      />

      <div className="flex-1 p-4 overflow-auto">
        {selectedTeamId ? (
          <TaskBoard
            teamId={selectedTeamId}
            currentUser={{
              id: user.uid,
              name: user.displayName || 'Anonymous',
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-xl font-semibold mb-2">{teams.length > 0 ? 'No Team Selected' : 'No Teams Available'}</h2>
            <p className="text-gray-600">
              {teams.length > 0
                ? 'Please select a team to start managing tasks'
                : 'Please create or join a team to get started'}
            </p>
          </div>

        )}
      </div>
    </div>
  );
}