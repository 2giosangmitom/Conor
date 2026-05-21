export interface TrendingVideo {
  id: string;
  title: string;
  youtubeId: string;
  duration: number;
  topic: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  practiceCount: number;
}

export interface Stat {
  icon: string;
  value: number;
  label: string;
  color: string;
  bgColor: string;
}

export interface HowToUseStep {
  icon: string;
  title: string;
  description: string;
  points: string[];
  color: string;
  bgColor: string;
}
