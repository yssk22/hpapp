interface User {
  id: string;
  username: string;
  accessToken: string;
}

type UserRole = "admin" | "developer" | "fcmember" | "user" | "guest";

export { User, UserRole };
