// lib/firebase/teamService.ts
import { 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    getDoc,
    query,
    where,
    onSnapshot,
    arrayUnion,
    arrayRemove,
    serverTimestamp,
    Timestamp
  } from 'firebase/firestore';
  import { db } from './config';
  import { ITeam, ICreateTeam, ITeamMember } from './types';
import { getDocs } from 'firebase/firestore/lite';
  
  class TeamServiceClass {
    private teamsCollection = collection(db, 'teams');
  
    private generateJoinCode(): string {
      // Generate a random 6-character alphanumeric code
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
  
    async createTeam(teamData: ICreateTeam, owner: ITeamMember): Promise<string> {
      const joinCode = this.generateJoinCode();
      
      const docRef = await addDoc(this.teamsCollection, {
        ...teamData,
        joinCode,
        members: [owner],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    }
  
    async joinTeam(joinCode: string, member: ITeamMember): Promise<boolean> {
      const q = query(this.teamsCollection, where('joinCode', '==', joinCode));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        throw new Error('Invalid team code');
      }
  
      const teamDoc = snapshot.docs[0];
      const teamData = teamDoc.data();
      
      // Check if user is already a member
      if (teamData.members.some((m: ITeamMember) => m.userId === member.userId)) {
        throw new Error('You are already a member of this team');
      }
  
      await updateDoc(teamDoc.ref, {
        members: arrayUnion(member),
        updatedAt: serverTimestamp()
      });
  
      return true;
    }
  
    async leaveTeam(teamId: string, userId: string): Promise<void> {
      const teamRef = doc(this.teamsCollection, teamId);
      const teamSnap = await getDoc(teamRef);
      
      if (!teamSnap.exists()) {
        throw new Error('Team not found');
      }
  
      const teamData = teamSnap.data();
      const member = teamData.members.find((m: ITeamMember) => m.userId === userId);
  
      if (!member) {
        throw new Error('User is not a member of this team');
      }
  
      if (member.role === 'owner') {
        throw new Error('Team owner cannot leave the team');
      }
  
      await updateDoc(teamRef, {
        members: arrayRemove(member),
        updatedAt: serverTimestamp()
      });
    }
  
    subscribeToUserTeams(userId: string, callback: (teams: ITeam[]) => void): () => void {
      const q = query(this.teamsCollection, where('members', 'array-contains', { userId }));
      return onSnapshot(q, (snapshot) => {
        const teams = snapshot.docs.map((doc) => ({ ...doc.data(), teamId: doc.id })) as ITeam[];
        callback(teams);
      });
    }
    
  
    subscribeToTeamById(teamId: string, callback: (team: ITeam | null) => void): () => void {
      const teamRef = doc(this.teamsCollection, teamId);
      
      return onSnapshot(teamRef, (doc) => {
        if (!doc.exists()) {
          callback(null);
          return;
        }
  
        const data = doc.data();
        const team = {
          teamId: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp).toDate(),
          updatedAt: (data.updatedAt as Timestamp).toDate()
        } as ITeam;
        
        callback(team);
      });
    }
    async getTeamById(teamId: string): Promise<ITeam | null> {
      const teamRef = doc(this.teamsCollection, teamId);
      const teamSnap = await getDoc(teamRef);
      
      if (!teamSnap.exists()) {
        return null;
      }
  
      const data = teamSnap.data();
      return {
        teamId: teamSnap.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
        updatedAt: (data.updatedAt as Timestamp).toDate()
      } as ITeam;
    }
  }
  
  export const teamService = new TeamServiceClass();