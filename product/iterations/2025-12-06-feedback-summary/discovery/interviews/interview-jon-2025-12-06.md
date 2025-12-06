# Interview: Jon Dickinson

## Metadata
- **Date**: 2025-12-06
- **Participant**: Jon Dickinson
- **Role**: Product Owner / Stakeholder
- **Duration**: ~10 minutes
- **Interviewer**: AI Assistant
- **Method**: AI-guided structured interview

## Context
Discovery interview for the feedback-summary iteration focused on implementing a feature to help plan the next event based on survey feedback from the current event.

## Key Findings

### Business Drivers
- Need to prepare for next year's event planning
- Currently collecting structured data across 19 survey questions (mix of qualitative and quantitative)
- Want simplified, actionable recommendations that event planners can act on
- Data is spread across multiple question types making manual analysis time-consuming

### Target Users
- **Primary users**: Internal event planning team
- **Use case**: Generate insights once all submissions are in
- **Workflow**: Generate written recommendations → review internally → share with others for review
- **Regeneration**: Users want ability to regenerate if more submissions come in

### Feature Requirements

#### Report Structure
- Structured sections: "What worked well", "Areas for improvement", "Recommended changes for next year"
- Must reference actual survey data with statistics (e.g., percentages, counts)
- Must clearly identify the number of responses analyzed

#### Technical Requirements
- Use Claude API for AI-powered analysis and recommendations
- Data is anonymized - no major privacy concerns
- **PII filtering required**: Any PII data must be excluded before sending to Claude
- Persist the last generated report
- Allow users to regenerate the report on demand
- Show notification if new submissions received since last report generation

#### Export
- PDF export capability required

### Success Metrics
- Time savings for planning team (reduce manual analysis hours)
- Improved decision quality (catch insights that might be missed manually)
- Quick turnaround (actionable recommendations within minutes of survey close)

### MVP Scope

#### In Scope
- AI-generated recommendations using Claude API
- Structured report with categories (What worked, Areas for improvement, Recommendations)
- Data citations with response counts and statistics
- PDF export
- Persist last generated report
- "New submissions since last report" indicator
- Regenerate capability
- PII filtering before sending to Claude

#### Out of Scope (Future Iterations)
- Comparison with previous years' events
- Multiple saved report versions/history
- Customizable report sections
- Email/share report directly from the system

### Dependencies & Constraints
- No specific timeline pressures identified
- No technical constraints on PDF library or Claude model version
- Open to implementation recommendations

## Direct Quotes
> "We want a simplified summary of recommendations that event planners can act on."

> "They would generate these insights once all of the submissions are in. If there are more submissions they would want to re-generate the recommendations."

> "We want users to be informed if there have been any additional submissions since the last report generation."

## Insights & Observations
1. Strong focus on actionability - the output needs to be practical, not just analytical
2. Internal workflow involves sharing recommendations for review - suggests need for clean, professional output
3. Regeneration capability indicates iterative data collection process
4. PII awareness shows good security consciousness even with anonymized data

## Open Questions
- What specific PII fields might exist in the survey responses that need filtering?
- Should the "new submissions" indicator show a count or just a flag?
- What level of detail is expected in the recommendations (high-level themes vs. specific action items)?

## Tags
`discovery` `stakeholder-interview` `feedback-summary` `ai-recommendations` `pdf-export` `mvp-scope`
