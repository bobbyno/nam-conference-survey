# Discovery Synthesis: Feedback Summary

**Synthesis Date**: 2025-12-06
**Iteration**: 2025-12-06-feedback-summary
**Research Period**: 2025-12-06

---

## Executive Summary

This iteration addresses the need for conference organizers to generate actionable, AI-powered recommendations from survey feedback to inform next year's event planning. The MVP focuses on using Claude API to analyze all 19 survey questions, generate structured reports with data citations, and enable PDF export for sharing. Key considerations include PII filtering before AI processing, report persistence with regeneration capability, and a new-submissions indicator.

---

## Research Overview

**Interviews Conducted**: 1
**Observations**: 0
**Other Sources**: Product context, previous iteration synthesis

### Participants

| # | Role | Date | Key Focus |
|---|------|------|-----------|
| 1 | Product Owner / Stakeholder | 2025-12-06 | AI-powered recommendations, report structure, export requirements |

---

## Key Themes

### Theme 1: Actionable Recommendations for Event Planning

**Summary**: Organizers need simplified, practical recommendations that event planners can immediately act upon.

**Evidence**:
- Interview: "We want a simplified summary of recommendations that event planners can act on."
- Interview: Business driver is preparing for next year's event planning
- Interview: Primary users are internal event planning team

**Impact**: High

**User Need**: When I have collected all survey feedback, I want the system to generate actionable recommendations so I can improve next year's conference without manually analyzing 19 questions of mixed data types.

---

### Theme 2: Structured Report with Data Citations

**Summary**: Reports must reference actual survey data with statistics to support credibility and decision-making.

**Evidence**:
- Interview: "They should reference data from the survey"
- Interview: "It's also important to identify the number of responses"
- Interview: Report structure should include percentages and counts

**Impact**: High

**User Need**: When I review AI-generated recommendations, I want to see the supporting data (response counts, percentages) so I can validate the insights and share them confidently with stakeholders.

---

### Theme 3: Report Lifecycle Management

**Summary**: Users need control over report generation with visibility into data freshness.

**Evidence**:
- Interview: "They would generate these insights once all of the submissions are in. If there are more submissions they would want to re-generate the recommendations."
- Interview: "We want to persist the last generated report."
- Interview: "We also want users to be informed if there have been any additional submissions since the last report generation."

**Impact**: High

**User Need**: When submissions continue arriving after I've generated a report, I want to be notified of new data and able to regenerate the report so I can ensure my recommendations reflect all available feedback.

---

### Theme 4: Minimum Data Threshold for Analysis

**Summary**: The system requires a minimum number of responses before generating meaningful AI analysis.

**Evidence**:
- PM Follow-up: Confirmed minimum of 3 responses required
- Interview: Data is anonymized; no PII is captured in survey responses

**Impact**: Medium

**User Need**: When there are fewer than 3 survey responses, I want the system to indicate insufficient data so I can wait for more submissions before generating recommendations.

---

### Theme 5: Shareable Output Format

**Summary**: Reports need professional export format for internal review and external sharing.

**Evidence**:
- Interview: "Export as PDF would be good."
- Interview: "A set of written recommendations that they can act upon and also send for review to others."
- Interview: Workflow involves internal generation then sharing for review

**Impact**: Medium

**User Need**: When I have generated recommendations, I want to export them as a PDF so I can share them with stakeholders who don't have system access.

---

## Pain Points (Ranked)

| Rank | Pain Point | Severity | Frequency | Users Affected |
|------|------------|----------|-----------|----------------|
| 1 | Manual analysis of 19 mixed-format questions is time-consuming | High | Per event cycle | Conference Organizers |
| 2 | Difficulty synthesizing qualitative and quantitative data together | High | Per event cycle | Conference Organizers |
| 3 | No automated way to generate shareable recommendations | Medium | Per event cycle | Conference Organizers |

---

## User Needs

### Must Address
1. **AI-Powered Analysis**: Generate recommendations from survey data using Claude API - Evidence: Direct stakeholder requirement
2. **Structured Report Sections**: Organize output into "What worked well", "Areas for improvement", "Recommendations for next year" - Evidence: Interview specified these categories
3. **Data Citations**: Include response counts and statistics in recommendations - Evidence: "Reference data from the survey... identify the number of responses"
4. **Report Persistence**: Store the last generated report for future access - Evidence: "Persist the last generated report"
5. **Regeneration Capability**: Allow users to regenerate reports when new data arrives - Evidence: "Re-generate the recommendations if there are more submissions"
6. **New Submissions Count**: Show count of new submissions since last report generation - Evidence: PM follow-up confirmed count (not just flag)
7. **Specific Action Items**: Recommendations should be specific actionable items, not high-level themes - Evidence: PM follow-up
8. **Minimum Response Threshold**: Require at least 3 responses before generating AI analysis - Evidence: PM follow-up

### Should Address
1. **PDF Export**: Enable download of recommendations as PDF document - Evidence: "Export as PDF would be good"

### Could Address
1. **Professional Formatting**: Ensure report output is suitable for stakeholder sharing - Evidence: "Send for review to others"

---

## Opportunities

### Validated Opportunities

1. **AI Recommendation Engine**
   - Use Claude API to analyze all 19 survey questions
   - Generate structured recommendations with three sections
   - Include data citations (counts, percentages)
   - Evidence: Direct stakeholder interview with clear requirements

2. **Report Management System**
   - Persist last generated report
   - Enable regeneration on demand
   - Show new-submissions indicator
   - Evidence: Explicit requirements from stakeholder

3. **Minimum Response Threshold**
   - Require 3+ responses before enabling AI analysis
   - Display insufficient data message when below threshold
   - Evidence: PM follow-up clarification

### Opportunities Deferred to Future Iterations

1. **Year-Over-Year Comparison**: Compare with previous years' events
2. **Report Version History**: Store multiple saved report versions
3. **Customizable Report Sections**: Allow users to configure report structure
4. **Direct Sharing**: Email or share report directly from the system

---

## Risks and Concerns

| Risk | Severity | Mitigation |
|------|----------|------------|
| Claude API response quality varies | Medium | Provide well-structured prompts with clear output expectations |
| Large response volumes may exceed API limits | Low | Monitor token usage; batch if needed |
| PDF generation complexity | Medium | Evaluate appropriate library for report formatting |
| Insufficient responses for analysis | Low | Enforce 3-response minimum with clear user messaging |

---

## Constraints

### Technical Constraints
- Must use Claude API (Anthropic) for AI analysis
- Must integrate with existing React + NestJS + PostgreSQL stack
- Minimum 3 responses required before AI analysis

### Business Constraints
- Internal team users only (no external access considerations)
- MVP scope - single persistent report, no version history

### Timeline Constraints
- None specified

---

## Cross-Iteration References

### Admin Dashboard (2025-12-02-admin-page)
- **Relationship**: Admin dashboard provides data viewing; feedback summary provides AI analysis
- **Synergy**: Both serve Conference Organizer persona
- **Technical Overlap**: Both require access to survey response data
- **Distinction**: Admin shows raw data; Feedback Summary synthesizes insights

### MVP Iteration (2025-11-12-mvp)
- **Relationship**: MVP established the 19-question survey structure
- **Dependency**: Feedback summary analyzes data collected via MVP survey
- **Question Types**: Mix of Likert, multi-select, ranking, open-ended questions

### Confirming Previous Research
- Conference Organizer persona needs validated (from target-users.md)
- Need for data analysis and reporting confirmed (from product-overview.md)

### New Findings
- Specific requirement for AI-powered recommendation generation (new)
- Structured report format with three sections (new)
- PII filtering requirement (new)
- New-submissions indicator (new)

---

## Recommendations

### Immediate Actions (This Iteration)
1. Define Claude API prompt structure for consistent recommendation output with specific action items
2. Determine report storage mechanism (database vs. file)
3. Design new-submissions count logic and display
4. Implement minimum 3-response threshold with user messaging

### Future Considerations
1. Consider report comparison features for year-over-year analysis
2. Evaluate need for report versioning as usage patterns emerge
3. Monitor API costs and response quality for optimization opportunities

---

## Open Questions

*All questions resolved via PM follow-up (2025-12-06):*

- [x] ~~What specific PII patterns might appear in survey responses that need filtering?~~ **Resolved**: No PII is captured in the survey - PII filtering not required.
- [x] ~~Should the new-submissions indicator show a count or just a flag?~~ **Resolved**: Show a count of new submissions.
- [x] ~~What level of detail is expected in recommendations?~~ **Resolved**: Specific action items, not just high-level themes.
- [x] ~~How should the system handle cases where there are too few responses?~~ **Resolved**: Minimum 3 responses required for meaningful AI analysis.

---

## Appendix

### Research Artifacts
- [Interview: Jon Dickinson (2025-12-06)](../interviews/interview-jon-2025-12-06.md)

### Key Quotes

> "We want a simplified summary of recommendations that event planners can act on."

> "They would generate these insights once all of the submissions are in. If there are more submissions they would want to re-generate the recommendations."

> "We want users to be informed if there have been any additional submissions since the last report generation."

### Methodology Notes
- Single stakeholder interview conducted using AI-guided structured interview format
- Discovery focused on MVP requirements with explicit out-of-scope items documented
- No additional observations or technical research conducted in this iteration
