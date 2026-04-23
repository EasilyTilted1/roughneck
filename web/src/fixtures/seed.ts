import blueprintValid from "../../../shared/schemas/fixtures/blueprint.valid.json";
import { DegreeBlueprintSchema, type DegreeBlueprint } from "@/lib/schemas";

export const seedBlueprint: DegreeBlueprint = DegreeBlueprintSchema.parse(blueprintValid);
