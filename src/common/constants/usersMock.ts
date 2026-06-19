export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "f38568a94102bc8cfb5ccdee",
    name: "Nicolás Fernández",
    email: "nicolas.fernandez@constructora.com",
    password: "password123",
    role: "super_admin",
    avatar: "https://i.pravatar.cc/150?u=nicolas.fernandez",
  },
  {
    id: "c41906bebfbda5a420d7f972",
    name: "Mateo Soto",
    email: "mateo.soto@constructora.com",
    password: "password123",
    role: "ingeniero_campo",
    avatar: "https://i.pravatar.cc/150?u=mateo.soto",
  },
  {
    id: "61fe1259dad197092ec47bb1",
    name: "Felipe Herrera",
    email: "felipe.herrera@constructora.com",
    password: "password123",
    role: "project-manager",
    avatar: "https://i.pravatar.cc/150?u=felipe.herrera",
  },
  {
    id: "cff0ccd8c7133e33778ba3e7",
    name: "Sebastián Castro",
    email: "sebastian.castro@constructora.com",
    password: "password123",
    role: "project-manager",
    avatar: "https://i.pravatar.cc/150?u=sebastian.castro",
  },
  {
    id: "8033067fd68ff910f084f75c",
    name: "Lucía Pardo",
    email: "lucia.pardo@constructora.com",
    password: "password123",
    role: "ingeniero_campo",
    avatar: "https://i.pravatar.cc/150?u=lucia.pardo",
  },
];
