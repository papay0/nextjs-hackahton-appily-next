/**
 * Detailed summary of the generation process results and metadata.
 */
export interface GenerationSummary {
  /** Whether all checks passed successfully */
  success: boolean;
  /** Number of attempts made to generate valid code */
  attempts: number;
  /** Linting errors if any occurred */
  lintError?: string | null;
  /** Build errors if any occurred */
  buildError?: string | null;
  /** Number of project files generated or modified */
  fileCount: number;
  /** Total duration of the entire generation process in milliseconds */
  totalDurationMs: number;
  /** Total number of input tokens used */
  inputTokens: number;
  /** Total number of output tokens generated */
  outputTokens: number;
  /** Cost of input tokens in USD */
  inputCost: number;
  /** Cost of output tokens in USD */
  outputCost: number;
  /** Total cost of the generation in USD */
  totalCost: number;
  /** The model key used for generation */
  modelKey: string;
  /** Whether there are actual lint errors in the generated code */
  hasActualLintErrors?: boolean;
  /** Timing information for different stages of generation */
  timings: Record<string, number>;
  /** Rate of output token generation */
  outputTokensPerSecond: number;
}

/**
 * Response structure from the code generation API
 */
export interface GenerateResponse {
  /** Directory where the project was generated */
  projectDir?: string;
  /** Unique identifier for the project */
  projectId: string;
  /** URL where the generated code is deployed */
  deployUrl?: string;
  /** Summary of the generation process */
  generationSummary: GenerationSummary;
}
