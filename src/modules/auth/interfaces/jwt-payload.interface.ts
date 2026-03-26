export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  status: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string;
}