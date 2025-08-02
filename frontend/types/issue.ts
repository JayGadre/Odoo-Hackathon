export type Issue = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "reported" | "in progress" | "resolved"; // or whatever statuses you support
  createdAt: string;
  latitude: number;
  longitude: number;
  votes: number;
  comments: string[]; // or better: Comment[] if you plan to expand
  history: {
    status: string;
    timestamp: string;
    note: string;
  }[];
};
