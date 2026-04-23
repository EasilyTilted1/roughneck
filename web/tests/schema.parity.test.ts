import { describe, it, expect } from "vitest";
import validFixture from "../../shared/schemas/fixtures/blueprint.valid.json";
import brokenFixture from "../../shared/schemas/fixtures/blueprint.broken.json";
import { DegreeBlueprintSchema } from "@/lib/schemas";

describe("schema parity (web side)", () => {
  it("parses blueprint.valid.json against the Zod DegreeBlueprint schema", () => {
    const result = DegreeBlueprintSchema.safeParse(validFixture);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.atoms).toHaveLength(4);
      expect(result.data.atoms[0].id).toBe("atom-intro");
    }
  });

  it("parses blueprint.broken.json (structure is valid even though the graph is broken)", () => {
    const result = DegreeBlueprintSchema.safeParse(brokenFixture);
    expect(result.success).toBe(true);
    if (result.success) {
      const atomB = result.data.atoms.find((a) => a.id === "atom-b");
      expect(atomB?.prerequisites).toContain("atom-does-not-exist");
    }
  });
});
