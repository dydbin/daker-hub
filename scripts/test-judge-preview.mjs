import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { buildJudgePreviewReport, packJudgePreviewMeta } from "../lib/judge-preview.js";

const root = process.cwd();
const fixturePath = path.join(root, "data", "judge-preview-test-cases.json");
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

function includesFragment(list, fragment) {
  return list.some((item) => item.includes(fragment));
}

function findCheck(report, label) {
  return report.checks.find((item) => item.label === label) ?? null;
}

function buildSubmission(caseItem) {
  return {
    ...caseItem.submission,
    development_plan: packJudgePreviewMeta({
      developmentPlan: caseItem.submission.development_plan,
      extensionIdea: caseItem.meta.extensionIdea,
      verificationPlan: caseItem.meta.verificationPlan,
      checklist: caseItem.meta.checklist
    })
  };
}

function validateCase(caseItem) {
  const submission = buildSubmission(caseItem);
  const report = buildJudgePreviewReport(submission, fixture.hackathon);
  const { expect } = caseItem;

  assert.ok(report.total >= expect.minTotal, `${caseItem.id}: total ${report.total} < ${expect.minTotal}`);
  assert.ok(report.total <= expect.maxTotal, `${caseItem.id}: total ${report.total} > ${expect.maxTotal}`);

  for (const fragment of expect.mustIncludeImprovements ?? []) {
    assert.ok(includesFragment(report.improvements, fragment), `${caseItem.id}: missing improvement fragment "${fragment}"`);
  }

  for (const fragment of expect.mustIncludeStrengths ?? []) {
    assert.ok(includesFragment(report.strengths, fragment), `${caseItem.id}: missing strength fragment "${fragment}"`);
  }

  for (const label of expect.mustHaveBadChecks ?? []) {
    const item = findCheck(report, label);
    assert.ok(item, `${caseItem.id}: missing check "${label}"`);
    assert.equal(item.ok, false, `${caseItem.id}: expected BAD for "${label}"`);
  }

  for (const label of expect.mustHaveOkChecks ?? []) {
    const item = findCheck(report, label);
    assert.ok(item, `${caseItem.id}: missing check "${label}"`);
    assert.equal(item.ok, true, `${caseItem.id}: expected OK for "${label}"`);
  }

  return report;
}

const reports = fixture.cases.map((caseItem) => ({
  id: caseItem.id,
  label: caseItem.label,
  report: validateCase(caseItem)
}));

assert.ok(reports[0].report.total < reports[1].report.total, "expected minimal < documented-but-unverified");
assert.ok(reports[1].report.total < reports[2].report.total, "expected documented-but-unverified < ready");

console.log("Judge Preview fixture results");
for (const item of reports) {
  console.log(`- ${item.id} (${item.label}): ${item.report.total}점, ${item.report.meta.completedChecks}/${item.report.meta.totalChecks} checks`);
}
console.log("judge-preview test: ok");
