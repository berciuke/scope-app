"use client";

import { useParams } from "next/navigation";
import GroupDetails from "../../components/groups/GroupDetails";

export default function GroupPage() {
  const { groupId } = useParams();

  return <GroupDetails groupId={groupId} />;
}
