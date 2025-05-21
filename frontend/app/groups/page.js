"use client";
import GroupForm from "../components/groups/GroupForm";
import GroupList from "../components/groups/GroupList";

export default function GroupsPage() {
  return (
    <div className="container mx-auto p-4">
      <GroupForm />
      <GroupList />
    </div>
  );
}
