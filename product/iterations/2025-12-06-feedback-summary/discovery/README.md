# Iteration Discovery: 2025-12-06-feedback-summary

**Started**: 2025-12-06
**Focus**: Implement a feature to help plan the next event based on feedback from this event
**Status**: Active

## Goals
Create an AI-powered feedback summary system that:
- Analyzes survey responses across 19 questions (qualitative and quantitative)
- Generates structured, actionable recommendations for event planners
- Provides data-backed insights with response counts and statistics
- Enables PDF export for sharing and review

## Research Methods
- [x] AI-guided stakeholder interview (Jon Dickinson, 2025-12-06)
- [ ] Technical observations
- [ ] Additional research as needed

## Timeline
- **Start**: 2025-12-06
- **Target synthesis**: Ready for synthesis

## Key Decisions
1. **AI Provider**: Use Claude API for recommendation generation
2. **Report Structure**: Three sections - "What worked well", "Areas for improvement", "Recommendations for next year"
3. **Data Handling**: PII must be filtered before sending to Claude API
4. **Persistence**: Store last generated report, allow regeneration
5. **User Notification**: Show indicator when new submissions exist since last report

## MVP Scope
### In Scope
- AI-generated recommendations using Claude API
- Structured report with data citations
- PDF export
- Persist last generated report
- New submissions indicator
- Regenerate capability
- PII filtering

### Out of Scope (Future)
- Comparison with previous years
- Multiple saved report versions
- Customizable report sections
- Direct email/share from system

## Notes
- Primary users are internal event planning team
- Workflow: Generate → Review internally → Share for external review
- Success measured by time savings and improved insight quality
- No timeline pressures or specific technical constraints
