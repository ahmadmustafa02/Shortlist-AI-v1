import { z } from "zod";

export const TIME_BUDGETS = [
  {
    value: "lt_1_week",
    label: "Less than 1 week",
    sub: "Apply now — let's tighten what you have",
  },
  {
    value: "1_2_weeks",
    label: "1–2 weeks",
    sub: "Quick wins + a few high-leverage skills",
  },
  {
    value: "lt_1_month",
    label: "Less than 1 month",
    sub: "Mini-project + targeted upskilling",
  },
  {
    value: "1_3_months",
    label: "1–3 months",
    sub: "Real project, deeper learning, portfolio polish",
  },
  {
    value: "3_6_months",
    label: "3–6 months",
    sub: "Build serious depth and a body of work",
  },
  {
    value: "6_plus_months",
    label: "6+ months",
    sub: "Career-changing roadmap with milestones",
  },
] as const;

export type TimeBudget = (typeof TIME_BUDGETS)[number]["value"];

export const jobInputSchema = z.object({
  jobTitle: z
    .string()
    .trim()
    .min(2, { message: "Job title is required" })
    .max(120, { message: "Keep job title under 120 characters" }),
  company: z
    .string()
    .trim()
    .max(120, { message: "Keep company name under 120 characters" })
    .optional()
    .or(z.literal("")),
  jdText: z
    .string()
    .trim()
    .min(80, { message: "Paste at least a paragraph of the job description (min 80 chars)" })
    .max(20000, { message: "Job description is too long (max 20k chars)" }),
});

export type JobInput = z.infer<typeof jobInputSchema>;

export const timeBudgetSchema = z.object({
  timeBudget: z.enum(TIME_BUDGETS.map((t) => t.value) as [TimeBudget, ...TimeBudget[]], {
    errorMap: () => ({ message: "Pick how much time you have" }),
  }),
});
