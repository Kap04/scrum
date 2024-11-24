// app/s/page.tsx
'use client'
import TaskBoard from '@/components/TaskBoard';

export default function TaskPage() {
  return (
    <div className="p-4">
      <TaskBoard 
        teamId="team-1"
        currentUser={{ id: "user-1", name: "John Doe" }}
      />
    </div>
  );
}


