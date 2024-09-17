import fs from "node:fs/promises";
import { defineConfig } from "sponsorkit";

export default defineConfig({
  cacheFile: ".sponsorkit/cache.json",
  outputDir: ".",
  formats: ["svg", "png"],
  renders: [
    {
      name: "sponsors.tiers",
      width: 800,
      renderer: "tiers",
      includePastSponsors: true,
    },
    {
      name: "sponsors.circles",
      width: 1000,
      renderer: "circles",
      includePastSponsors: true,
    },
  ],
  async onSponsorsReady(sponsors) {
    await fs.writeFile(
      "sponsors.json",
      JSON.stringify(
        sponsors
          .filter((e) => e.privacyLevel !== "PRIVATE")
          .map((e) => ({
            name: e.sponsor.name ?? e.sponsor.login,
            ref: e.provider,
            socials: {
              ...e.sponsor.socialLogins,
              website: e.sponsor.websiteUrl,
            },
            createdAt: e.createdAt,
            expireAt: e.expireAt,
            tier: {
              name: e.tierName,
              amount: e.monthlyDollars,
              oneTime: e.isOneTime,
            },
          }))
          .sort((a, b) => b.tier.amount - b.tier.amount)
      )
    );
  },
});
