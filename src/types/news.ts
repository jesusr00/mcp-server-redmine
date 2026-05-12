export interface NewsItem {
  id: number;
  project: { id: number; name: string };
  author: { id: number; name: string };
  title: string;
  summary: string;
  description: string;
  created_on: string;
}
