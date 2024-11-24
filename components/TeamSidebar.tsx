// components/TeamSidebar.tsx

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';
import { teamService } from '@/lib/firebase/teamService';
import TeamForm from './TeamForm';
import JoinTeamDialog from './JoinTeamDialogBox';
import { ITeam } from '@/lib/firebase/types';

interface TeamSidebarProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
  };
  onTeamSelect: (teamId: string) => void;
  selectedTeamId: string | undefined;
}

const TeamSidebar = ({ currentUser, onTeamSelect, selectedTeamId }: TeamSidebarProps) => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = teamService.subscribeToUserTeams(currentUser.id, (newTeams) => {
      setTeams(newTeams);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser.id]);

  useEffect(() => {
    const lastSelectedTeam = localStorage.getItem('selectedTeamId');
    if (lastSelectedTeam) {
      onTeamSelect(lastSelectedTeam);
    }
  }, [onTeamSelect]);

  const handleTeamSelect = (teamId: string) => {
    localStorage.setItem('selectedTeamId', teamId);
    onTeamSelect(teamId);
  };

  return (
    <div className="w-64 bg-gray-100 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Teams</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsJoinTeamOpen(true)}
          >
            <Users className="w-4 h-4 mr-1" />
            Join
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateTeamOpen(true)}
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>
      </div>

      <div className="space-y-2 flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <span>Loading...</span>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center text-gray-500">
            No teams yet. Create or join a team to get started!
          </div>
        ) : (
          teams.map((team) => (
            <Button
              key={team.teamId}
              variant={selectedTeamId === team.teamId ? "default" : "ghost"}
              className="w-full justify-start flex items-center gap-2"
              onClick={() => handleTeamSelect(team.teamId)}
            >
              
              {team.name}
            </Button>
          ))
        )}
      </div>

      <TeamForm
        isOpen={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
        currentUser={currentUser}
        onTeamCreated={handleTeamSelect} // Set the newly created team as selected
      />

      <JoinTeamDialog
        isOpen={isJoinTeamOpen}
        onClose={() => setIsJoinTeamOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
};

export default TeamSidebar;
