export type GenerateUseCaseRequest = {
  businessProblem: string;
};

export type UseCaseInsight = {
  problemSummary: string;
  aiOpportunities: string[];
  expectedBusinessImpact: string;
};

export type GenerateUseCaseResponse = {
  data: UseCaseInsight;
};

export type ErrorResponse = {
  error: string;
};
