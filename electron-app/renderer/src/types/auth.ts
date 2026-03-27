export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  designationId: string;
  title: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};
