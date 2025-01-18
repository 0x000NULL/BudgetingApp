export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthenticatedContext {
  user: User;
}