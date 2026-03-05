import { z } from "zod";

export const generateUseCaseRequestSchema = z.object({
  businessProblem: z
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters describing the problem.")
    .max(600, "Please keep the problem statement under 600 characters.")
});

export const useCaseInsightSchema = z.object({
  problemSummary: z.string().min(20),
  aiOpportunities: z.array(z.string().min(8)).min(2).max(3),
  expectedBusinessImpact: z.string().min(20)
});
