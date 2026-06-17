export interface Incident {
  id: string;
  sequenceId: string;
  order: number;
  title: string;
  description: string;
  type: {
    id: string;
    key: string;
    name: string;
    name_en: string;
  };
  priority: string;
  status: string;
  approval: boolean;
  project: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  } | null;
  whatsappOwner: null | string;
  assignees: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  }[];
  observers: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
  }[];
  coordinates: {
    lat: number;
    lng: number;
  };
  locationDescription: string;
  dueDate: string | null;
  closingDate: string | null;
  media: {
    id: string;
    name: string;
    type: string;
    format: string;
    size: number;
    status: string;
    url: string;
  }[];
  tags: {
    id: string;
    name: string;
    color: string;
  }[];
  deleted: boolean | null;
  createdAt: string;
  updatedAt: string;
}
