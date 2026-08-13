export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'manager' | 'staff';
  isActive: boolean;
  storeIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    storeIds: string[];
  };
  expires: string;
}