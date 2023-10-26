import { useMemo } from "react";
import useCurrentUser from "@hpapp/features/auth/useCurrentUser";
import { User, UserRole } from "@hpapp/features/auth/types";

const adminId = "42949672973"; // TODO: move it to secrets.json
const developerId = "42949672973"; // TODO: move it to secrets.json

export default function useUserRoles(user?: User): Array<UserRole> {
  const [current] = useCurrentUser();
  user = useMemo(() => {
    return user == undefined ? current : user;
  }, [user, current]);
  return useMemo(() => {
    const roles: Array<UserRole> = [];
    if (user?.id == adminId) {
      roles.push("admin");
    }
    if (user?.id == developerId) {
      roles.push("developer");
    }
    if (typeof user?.id == "string") {
      roles.push("user");
    }
    // TODO: fcmember
    if (roles.length == 0) {
      roles.push("guest");
    }
    return roles;
  }, [user]);
}
