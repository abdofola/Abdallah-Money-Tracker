import React from "react";
import { useAppSelector } from "@app/hooks";
import { selectCurrentUser } from "@features/auth";

export function useAuth() {
  const user = useAppSelector(selectCurrentUser);

  return React.useMemo(() => ({ user }), [user]);
}
