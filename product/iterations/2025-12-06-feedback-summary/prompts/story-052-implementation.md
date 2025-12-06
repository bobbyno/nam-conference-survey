# Implementation Prompt: AI Feedback Summary Generation

**Story ID**: STORY-052
**Feature**: AI-powered conference feedback analysis using Claude API
**Target**: Conference Organizer admin dashboard

## Objective

Implement an AI-powered feedback summary generation feature that analyzes survey responses and produces actionable recommendations for conference organizers. The system should synthesize both quantitative (Likert scales, rankings, multi-select) and qualitative (open-ended) data from 19 survey questions into a structured report with three sections: "What worked well", "Areas for improvement", and "Recommendations for next year".

## Technical Requirements

### Backend Implementation

#### 1. Claude API Integration

**Create new service**: `apps/backend/src/modules/admin/feedback-summary.service.ts`

- Integrate with Anthropic Claude API (use `@anthropic-ai/sdk` npm package)
- Configuration:
  - Add `ANTHROPIC_API_KEY` to environment variables
  - Add to `apps/backend/.env.example`: `ANTHROPIC_API_KEY=your_api_key_here`
  - Use ConfigModule to access the API key (never direct `process.env`)
- Implement `generateFeedbackSummary()` method that:
  - Queries all submitted survey responses from Prisma
  - Validates minimum response count (≥3)
  - Aggregates quantitative data (counts, percentages, averages)
  - Compiles qualitative responses
  - Constructs prompt for Claude API
  - Calls Claude API with appropriate model (recommend `claude-3-5-sonnet-20241022`)
  - Parses and validates AI response structure
  - Returns structured summary DTO

**Data aggregation strategy**:
- Likert scales (q1, q2, q5, q6, q9): Calculate average, distribution percentages
- Likert with N/A (q3, q8, q10, q13): Calculate average excluding N/A, show N/A count
- Multi-select (q4, q17): Count selections, calculate percentages
- Rankings (q11): Analyze top-ranked items, calculate average positions
- Single choice (q12, q16, q18): Count and percentage per option
- Open-ended (q7, q14, q15): Group and include verbatim responses

**Prompt engineering guidelines**:
- Instruct Claude to return JSON with three sections: `whatWorkedWell`, `areasForImprovement`, `recommendationsForNextYear`
- Each section should be an array of objects with `insight` (string) and `evidence` (string with data citations)
- Emphasize specific, actionable recommendations over generic themes
- Request data citations with response counts and percentages
- Include total response count in context
- Example prompt structure:
  ```
  You are analyzing conference feedback from {responseCount} survey responses.

  Survey data:
  [Aggregated quantitative data]
  [Qualitative responses grouped by question]

  Generate a structured analysis with three sections:
  1. What worked well (3-5 insights with supporting data)
  2. Areas for improvement (3-5 insights with supporting data)
  3. Recommendations for next year (5-7 specific action items)

  Return JSON format:
  {
    "whatWorkedWell": [{"insight": "...", "evidence": "..."}],
    "areasForImprovement": [{"insight": "...", "evidence": "..."}],
    "recommendationsForNextYear": [{"insight": "...", "evidence": "..."}]
  }
  ```

#### 2. Create DTOs

**Request DTO**: `apps/backend/src/modules/admin/dto/generate-feedback-summary.dto.ts`
- Empty DTO (trigger-only endpoint, no parameters)

**Response DTO**: `apps/backend/src/modules/admin/dto/feedback-summary.dto.ts`
```typescript
export class FeedbackInsightDto {
  insight: string;
  evidence: string;
}

export class FeedbackSummaryDto {
  responseCount: number;
  generatedAt: Date;
  whatWorkedWell: FeedbackInsightDto[];
  areasForImprovement: FeedbackInsightDto[];
  recommendationsForNextYear: FeedbackInsightDto[];
}
```

**Error response**: `InsufficientDataException` (custom exception)
```typescript
export class InsufficientDataException extends BadRequestException {
  constructor(currentCount: number, requiredCount: number) {
    super({
      message: 'Insufficient survey responses for analysis',
      currentCount,
      requiredCount,
    });
  }
}
```

#### 3. Controller Endpoint

**Extend**: `apps/backend/src/modules/admin/admin.controller.ts`

```typescript
@Post('feedback-summary/generate')
async generateFeedbackSummary(): Promise<FeedbackSummaryDto> {
  return this.feedbackSummaryService.generateFeedbackSummary();
}
```

- Use `@Post()` decorator (generation is not idempotent, creates new analysis)
- Handle exceptions:
  - `InsufficientDataException` → 400 Bad Request
  - Claude API errors → 500 Internal Server Error with retry guidance
  - Timeout → 504 Gateway Timeout (set 30s timeout)

#### 4. Module Registration

**Update**: `apps/backend/src/modules/admin/admin.module.ts`
- Import and provide `FeedbackSummaryService`
- Ensure `PrismaModule` is imported
- Ensure `ConfigModule` is available

#### 5. Testing

**Unit tests**: `apps/backend/src/modules/admin/feedback-summary.service.spec.ts`
- Mock Prisma client
- Mock Claude API client
- Test scenarios:
  - Insufficient responses (< 3)
  - Successful generation with 3+ responses
  - Claude API failure
  - Invalid JSON response from Claude
  - Timeout handling

**E2E tests**: `apps/backend/test/admin.e2e-spec.ts`
- Test `/admin/feedback-summary/generate` endpoint
- Mock Claude API in test environment

### Frontend Implementation

#### 1. API Client

**Extend**: `apps/frontend/src/api/admin.ts`

```typescript
export interface FeedbackInsight {
  insight: string;
  evidence: string;
}

export interface FeedbackSummary {
  responseCount: number;
  generatedAt: string;
  whatWorkedWell: FeedbackInsight[];
  areasForImprovement: FeedbackInsight[];
  recommendationsForNextYear: FeedbackInsight[];
}

export async function generateFeedbackSummary(): Promise<FeedbackSummary> {
  const response = await fetch(`${API_BASE_URL}/admin/feedback-summary/generate`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate feedback summary');
  }

  return response.json();
}
```

#### 2. Feedback Summary Component

**Create**: `apps/frontend/src/components/admin/FeedbackSummarySection.tsx`

Component structure:
- Header: "AI Feedback Summary" with generate button
- Loading state: Progress indicator with message "Generating summary... (this may take 15-30 seconds)"
- Insufficient data state: Alert showing current count and required count (3)
- Error state: Alert with retry button
- Success state: Three collapsible sections with insights

UI requirements:
- Use Mantine `Accordion` component for three sections
- Use Mantine `Button` with loading state for generate button
- Use Mantine `Alert` for error/info states
- Use Mantine `Loader` for generation in progress
- Display response count and generation timestamp
- Each insight should show:
  - Insight text (bold)
  - Evidence citation (muted color, smaller font)

Accessibility:
- Proper ARIA labels on generate button
- Screen reader announcements for state changes
- Keyboard navigation through accordion
- Focus management after generation completes

Mobile responsiveness:
- Stack sections vertically on mobile
- Reduce padding on smaller screens
- Ensure text remains readable at 375px width

Example structure:
```tsx
<Stack gap="md">
  <Group justify="space-between">
    <Title order={2} size="h3">AI Feedback Summary</Title>
    <Button
      onClick={handleGenerate}
      loading={isGenerating}
      disabled={responseCount < 3}
    >
      Generate Summary
    </Button>
  </Group>

  {/* Insufficient data alert */}
  {responseCount < 3 && (
    <Alert icon={<IconAlertCircle />} color="blue">
      Need at least 3 responses to generate summary.
      Current count: {responseCount}
    </Alert>
  )}

  {/* Loading state */}
  {isGenerating && (
    <Stack align="center">
      <Loader size="lg" />
      <Text>Generating summary... (this may take 15-30 seconds)</Text>
    </Stack>
  )}

  {/* Error state */}
  {error && (
    <Alert icon={<IconAlertCircle />} color="red">
      {error}
      <Button onClick={handleRetry}>Retry</Button>
    </Alert>
  )}

  {/* Summary display */}
  {summary && (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        Based on {summary.responseCount} responses
        • Generated {formatDate(summary.generatedAt)}
      </Text>

      <Accordion>
        <Accordion.Item value="worked-well">
          <Accordion.Control>What Worked Well</Accordion.Control>
          <Accordion.Panel>
            {summary.whatWorkedWell.map((item, i) => (
              <InsightCard key={i} insight={item} />
            ))}
          </Accordion.Panel>
        </Accordion.Item>
        {/* ... other sections ... */}
      </Accordion>
    </Stack>
  )}
</Stack>
```

#### 3. Integrate into Admin Dashboard

**Update**: `apps/frontend/src/pages/AdminDashboardPage.tsx`

- Add `FeedbackSummarySection` component below `RecentResponsesSection`
- Pass current response count from metrics to enable/disable generation
- Handle state management for summary generation
- Add error boundary for AI generation failures

#### 4. Types

**Create**: `apps/frontend/src/types/feedback-summary.ts`
- Export TypeScript interfaces matching backend DTOs
- Consider using shared types from `packages/shared` if appropriate

### Database Schema

No schema changes required. Uses existing `SurveyResponse` model from Prisma schema.

## Acceptance Criteria Implementation Checklist

### Scenario 1: Generate Recommendations with Sufficient Data
- [ ] Backend validates ≥3 responses before calling Claude API
- [ ] Backend aggregates all 19 questions' data correctly
- [ ] Claude API integration returns structured JSON with three sections
- [ ] Frontend displays all three sections clearly
- [ ] Each recommendation includes specific action items

### Scenario 2: Data Citations in Recommendations
- [ ] Prompt instructs Claude to include response counts and percentages
- [ ] Frontend displays evidence citations for each insight
- [ ] Total response count is shown in summary header
- [ ] Citations reference actual survey data accurately

### Scenario 3: Insufficient Responses
- [ ] Backend throws `InsufficientDataException` when < 3 responses
- [ ] Frontend displays current count and minimum required (3)
- [ ] Generate button is disabled when insufficient data
- [ ] Clear messaging explains why generation is unavailable

### Scenario 4: API Error Handling
- [ ] Backend catches Claude API errors and returns 500/504
- [ ] Frontend displays user-friendly error message
- [ ] Retry button allows user to attempt generation again
- [ ] Timeout handling prevents indefinite waiting

### Non-Functional Requirements
- [ ] Performance: Report generation completes < 30 seconds
- [ ] Accessibility: Screen reader friendly, keyboard navigable
- [ ] Mobile: Responsive design works on tablet/desktop
- [ ] Usability: Progress indicator shown during generation

### Quality Checklist
- [ ] Report sections clearly delineated and scannable
- [ ] All acceptance criteria scenarios tested
- [ ] Data citations reflect actual survey data
- [ ] Recommendations are actionable and specific
- [ ] Error states provide clear guidance

## Environment Setup

### Required Environment Variables

**Backend** (`apps/backend/.env`):
```
ANTHROPIC_API_KEY=sk-ant-...
```

### Required Dependencies

**Backend**:
```bash
pnpm add @anthropic-ai/sdk
pnpm add -D @types/node
```

**Frontend**: No new dependencies required (uses existing Mantine components)

## Testing Strategy

### Manual Testing Steps

1. **Insufficient data scenario**:
   - Reset database or ensure < 3 responses
   - Navigate to admin dashboard
   - Verify generate button is disabled
   - Verify alert shows current count and minimum required

2. **Successful generation**:
   - Ensure ≥3 survey responses exist (use seed data)
   - Click "Generate Summary" button
   - Verify loading state appears
   - Wait for generation to complete (< 30s)
   - Verify three sections display with insights
   - Verify data citations reference actual survey data
   - Verify response count and timestamp are shown

3. **Error handling**:
   - Temporarily invalidate API key
   - Attempt generation
   - Verify error message displays
   - Verify retry button appears
   - Restore API key and retry

4. **Mobile/responsive**:
   - Resize browser to 375px width
   - Verify summary sections remain readable
   - Verify accordion navigation works
   - Test on tablet viewport (768px)

### Automated Tests

- Backend unit tests for `FeedbackSummaryService`
- Backend E2E tests for `/admin/feedback-summary/generate` endpoint
- Frontend component tests for `FeedbackSummarySection`
- Integration tests with mocked Claude API responses

## Performance Considerations

- Claude API calls should timeout after 30 seconds
- Consider caching generated summaries (future enhancement)
- Large response volumes (100+) may require pagination or sampling strategy
- Monitor token usage to avoid excessive API costs

## Security Considerations

- API key must be stored securely in environment variables
- Never expose `ANTHROPIC_API_KEY` in frontend code or version control
- Validate all input data before sending to Claude API
- Sanitize any user-generated content (names, locations) before including in prompts
- Consider rate limiting to prevent abuse (future enhancement)

## Open Questions Resolution

**Q: How to handle very large numbers of responses (100+) in terms of API token limits?**

**A (Implementation Decision)**:
- For MVP: Process all responses, rely on Claude's 200K token context window
- Monitor: Log token usage for each generation
- Future: If token limits become an issue:
  - Sample most recent N responses (e.g., 100)
  - Or paginate analysis into multiple API calls and synthesize
  - Or aggregate heavily and send only summary statistics for Likert/multi-select

For this initial implementation, proceed with all responses and add logging to track token usage. Adjust if issues arise.

## Reference Files

Review these files for existing patterns:

**Backend**:
- `apps/backend/src/modules/survey/survey.service.ts` - Service pattern
- `apps/backend/src/modules/admin/admin.service.ts` - Admin service example
- `apps/backend/src/modules/admin/admin.controller.ts` - Controller pattern
- `apps/backend/prisma/schema.prisma` - Database schema

**Frontend**:
- `apps/frontend/src/pages/AdminDashboardPage.tsx` - Admin page structure
- `apps/frontend/src/components/admin/ResponseDetailModal.tsx` - Modal pattern
- `apps/frontend/src/api/admin.ts` - API client pattern

**Architecture guidelines**:
- `CLAUDE.md` - Project overview and tech stack
- `rules/nestjs-rules.md` - NestJS patterns
- `rules/react-rules.md` - React patterns
- `rules/typescript-rules.md` - TypeScript conventions

## Implementation Order

1. **Backend foundation**:
   - Add dependencies and environment variables
   - Create `FeedbackSummaryService` with data aggregation
   - Create DTOs
   - Integrate Claude API
   - Write unit tests

2. **Backend endpoint**:
   - Add controller method
   - Register in module
   - Test with Postman/curl

3. **Frontend API client**:
   - Add types
   - Add API function

4. **Frontend UI**:
   - Create `FeedbackSummarySection` component
   - Integrate into `AdminDashboardPage`
   - Style and make responsive

5. **Testing and polish**:
   - Manual testing all scenarios
   - Fix any bugs
   - Accessibility review
   - Performance verification

## Success Criteria

The implementation is complete when:
- All acceptance criteria scenarios work as described
- All unit and E2E tests pass
- Manual testing confirms all user flows
- Code follows project conventions (NestJS, React, TypeScript rules)
- Error handling is robust and user-friendly
- UI is accessible and responsive
- Performance meets <30s generation time requirement
