# User Story: Feedback Report Management

**Story ID**: STORY-053
**Iteration**: 2025-12-06-feedback-summary
**Priority**: Must have
**Status**: Draft
**Labels**: 2025-12-06-feedback-summary, conference-organizer, report-lifecycle, llm-dev

## User Story
As a Conference Organizer,
I want to persist the last generated feedback report and see when new submissions have arrived since generation,
So that I can access my previous analysis without regenerating and know when to update my recommendations with fresh data.

## Context
Survey submissions may continue arriving after an initial report is generated. Organizers need to access the last generated report without regeneration, see how many new responses have been submitted since then, and regenerate on demand when ready to incorporate new data.

## Source
**Discovery Cycle**: 2025-12-06-feedback-summary
**Synthesis Reference**: product/iterations/2025-12-06-feedback-summary/discovery/synthesis/synthesis-2025-12-06.md
**User Need**: When submissions continue arriving after I've generated a report, I want to be notified of new data and able to regenerate the report so I can ensure my recommendations reflect all available feedback.
**Supporting Evidence**: Product Owner specified persisting last report, regeneration capability, and new-submissions count indicator.

## Acceptance Criteria

### Functional Scenarios

**Scenario 1: Persist Generated Report**
- **Given** a feedback summary report has been generated
- **When** the organizer navigates away and returns to the feedback summary page
- **Then** the previously generated report is displayed
- **And** the generation timestamp is shown

**Scenario 2: New Submissions Indicator**
- **Given** a feedback summary report was generated
- **When** new survey responses are submitted after the report generation
- **Then** a count of new submissions is displayed (e.g., "5 new responses since last report")
- **And** the indicator is prominently visible near the regenerate action

**Scenario 3: Regenerate Report**
- **Given** a previous report exists and new submissions have arrived
- **When** the organizer clicks the regenerate button
- **Then** a new report is generated incorporating all current responses
- **And** the new report replaces the previous one
- **And** the new-submissions count resets to zero
- **And** the generation timestamp updates

**Scenario 4: No New Submissions**
- **Given** a feedback summary report was generated
- **When** no new survey responses have been submitted since generation
- **Then** no new-submissions indicator is displayed (or shows "0 new responses")
- **And** the regenerate option is still available if the user wants to regenerate

**Scenario 5: First-Time Access (No Report Exists)**
- **Given** no feedback summary report has been generated yet
- **When** the organizer accesses the feedback summary page
- **Then** a clear call-to-action to generate the first report is displayed
- **And** the current total response count is shown

### Non-Functional Requirements
- [ ] Performance: Persisted report loads instantly (no API call needed to view existing report)
- [ ] Accessibility: New-submissions indicator is announced by screen readers
- [ ] Mobile: Works well on tablet screens
- [ ] Usability: Clear visual distinction between "view existing" and "regenerate" actions

### Quality Checklist
- [ ] Report persistence survives browser refresh and server restart
- [ ] All acceptance criteria scenarios work as described
- [ ] New-submissions count accurately reflects submissions since last generation
- [ ] Accessible to users with disabilities

## Open Questions
- Should there be a confirmation dialog before regenerating (which replaces the previous report)?

## Dependencies
- STORY-052: AI Feedback Summary Generation (must exist to persist)

## Estimate
**Size**: M
**Confidence**: High

**Reasoning**: Standard persistence pattern (database storage), straightforward count logic for new submissions. High confidence as patterns are well-established.

## Metadata
**Iteration**: 2025-12-06-feedback-summary
**Created**: 2025-12-06
**Last Updated**: 2025-12-06
**Build Date**:
