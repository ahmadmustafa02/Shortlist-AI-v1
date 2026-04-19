// Shared report shape produced by the analyze-application edge function.

export interface SkillGaps {
  missing_hard_skills: string[];
  missing_keywords: string[];
  missing_experience_signals: string[];
}

export interface TailoringTip {
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
}

export interface RoadmapPhase {
  name: string;
  focus: string;
  actions: string[];
}

export interface PrepRoadmap {
  overview: string;
  phases: RoadmapPhase[];
}

export interface BulletRewrite {
  before: string;
  after: string;
  why: string;
}

export interface InterviewQuestion {
  question: string;
  hint: string;
}

export interface InterviewQuestions {
  technical: InterviewQuestion[];
  behavioral: InterviewQuestion[];
}

export interface AnalysisReport {
  fit_score: number;
  fit_summary: string;
  ats_before: number;
  ats_after: number;
  skill_gaps: SkillGaps;
  tailoring_tips: TailoringTip[];
  prep_roadmap: PrepRoadmap;
  bullet_rewrites: BulletRewrite[];
  interview_questions: InterviewQuestions;
}
