// SITE-032: legacy editorial routes must fail-closed before any public launch.
const fs = require("node:fs");
const assert = require("node:assert/strict");
const catalog = fs.readFileSync("app/descobrir/page.tsx","utf8");
const article = fs.readFileSync("app/descobrir/[slug]/page.tsx","utf8");
for (const f of [catalog, article]) {
  assert(f.includes('lifecycleStatus === "PUBLISHED"') || f.includes('lifecycleStatus !== "PUBLISHED"'));
  assert(f.includes('LEGACY_EDITORIAL_REVIEW_REQUIRED'));
  assert(f.includes("derivePublishability"));
}
assert(article.includes("notFound()"));
console.log("SITE-032 legacy editorial guard: PASS");
