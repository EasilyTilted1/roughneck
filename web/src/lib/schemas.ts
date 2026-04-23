import { z } from "zod";

export const SourceLinkTypeSchema = z.enum(["doc", "paper", "video", "other"]);
export type SourceLinkType = z.infer<typeof SourceLinkTypeSchema>;

export const SourceLinkSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  type: SourceLinkTypeSchema,
  retrievedAt: z.string().datetime(),
});
export type SourceLink = z.infer<typeof SourceLinkSchema>;

export const AtomCategorySchema = z.enum(["Core", "Elective"]);
export type AtomCategory = z.infer<typeof AtomCategorySchema>;

export const LearningAtomSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  category: AtomCategorySchema,
  sourceLinks: z.array(SourceLinkSchema),
  prerequisites: z.array(z.string()),
});
export type LearningAtom = z.infer<typeof LearningAtomSchema>;

export const DegreeBlueprintSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  atoms: z.array(LearningAtomSchema),
  metadata: z.object({
    createdAt: z.string().datetime(),
    version: z.string(),
  }),
});
export type DegreeBlueprint = z.infer<typeof DegreeBlueprintSchema>;

export const FlagSeveritySchema = z.enum(["low", "med", "high"]);
export type FlagSeverity = z.infer<typeof FlagSeveritySchema>;

export const IntegrityFlagSchema = z.object({
  atomId: z.string(),
  reason: z.string(),
  severity: FlagSeveritySchema,
});
export type IntegrityFlag = z.infer<typeof IntegrityFlagSchema>;

export const PedagogicalIntegrityScoreSchema = z.object({
  score: z.number().min(0).max(100),
  flags: z.array(IntegrityFlagSchema),
});
export type PedagogicalIntegrityScore = z.infer<typeof PedagogicalIntegrityScoreSchema>;
