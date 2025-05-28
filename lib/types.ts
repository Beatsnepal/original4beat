
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}
