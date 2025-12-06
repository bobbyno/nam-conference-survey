# Implementation Prompt: Response Detail Modal

**Story Reference**: STORY-046 - Response Detail Modal
**Iteration**: 2025-12-02-admin-page
**Priority**: Must Have

## Objective

Implement a modal dialog that displays complete survey response details when an organizer clicks "View" on a response in the Recent Responses list. The modal must show all 19 questions with their answers, formatted appropriately for each question type (Likert, multi-select, ranking, open-ended).

## Prerequisites

- STORY-045 (Admin Overview Page) must be completed
- Survey submission functionality exists from MVP iteration
- Database schema contains response data with all 19 questions

## Implementation Requirements

### 1. Backend API Endpoint

**Create GET endpoint**: `/api/survey/responses/:id`

**Response structure**:
```typescript
{
  id: number;
  submittedAt: Date;
  questions: [
    {
      questionNumber: number;
      questionText: string;
      questionType: 'likert' | 'multiselect' | 'ranking' | 'openended';
      answer: any; // Type varies by question type
    }
  ];
}
```

**Requirements**:
- Fetch complete response by ID from database
- Return all 19 questions in order (Q1-Q19)
- Include question text and type metadata
- Handle cases where questions are unanswered (null values)
- Add proper error handling for invalid/non-existent IDs
- Apply admin authentication/authorization (if implemented)

**Location**: `apps/backend/src/modules/survey/` (add to existing survey module)

### 2. Frontend Modal Component

**Create component**: `apps/frontend/src/components/admin/ResponseDetailModal.tsx`

**Props interface**:
```typescript
interface ResponseDetailModalProps {
  responseId: number | null;
  opened: boolean;
  onClose: () => void;
}
```

**Component structure**:
- Use Mantine's `Modal` component
- Modal configuration:
  - Width: 600px
  - Max height: 80vh
  - Centered: true
  - Close on overlay click: true
  - Close on escape: true
  - Trap focus: true

**Header section**:
- Title: "Response #[ID]"
- Subtitle: "Submitted: [formatted timestamp]" (use friendly format like "Dec 2, 2025 2:34pm")
- Close button with accessible label

**Body section**:
- Scrollable container for all questions
- Render questions in order (Q1-Q19)
- Display each question with appropriate formatting (see Question Display section below)

### 3. Question Display Formatting

Create helper component or function to render answers by type:

**Likert Scale Questions**:
- Display star rating visual (★★★★☆)
- Show numeric value and label: "(4 - Satisfied)"
- Use filled stars for rating value, empty stars for remainder
- Implementation: Consider using Mantine's `Rating` component or custom star rendering

**Multi-Select Questions**:
- Render as bulleted list
- Each selected option on separate line with bullet (•)
- Example:
  ```
  • AI/ML
  • Cloud Architecture
  • DevOps Practices
  ```

**Ranking Questions**:
- Render as numbered list in rank order
- Example:
  ```
  1. Keynote
  2. Workshop A
  3. Panel Discussion
  ```

**Open-Ended Questions**:
- Display as quoted text block
- Preserve line breaks from original response
- Use appropriate text styling (possibly gray background or border)

**Unanswered Questions**:
- Show question text followed by italic "No response"
- Example: "Q15: Additional Comments" → "No response" (italic)

### 4. Integration with Admin Overview Page

**Modify**: `apps/frontend/src/pages/admin/AdminOverviewPage.tsx` (or equivalent)

**Changes needed**:
1. Add state for modal control:
   ```typescript
   const [selectedResponseId, setSelectedResponseId] = useState<number | null>(null);
   const [modalOpened, setModalOpened] = useState(false);
   ```

2. Add click handler to "View" links in Recent Responses table:
   ```typescript
   const handleViewResponse = (responseId: number) => {
     setSelectedResponseId(responseId);
     setModalOpened(true);
   };
   ```

3. Render modal component:
   ```typescript
   <ResponseDetailModal
     responseId={selectedResponseId}
     opened={modalOpened}
     onClose={() => {
       setModalOpened(false);
       setSelectedResponseId(null);
     }}
   />
   ```

4. Update "View" link/button to call handler

### 5. Data Fetching

**In ResponseDetailModal**:
- Use React Query (if available) or standard useEffect + fetch
- Fetch data when modal opens (when `opened` becomes true and `responseId` is set)
- Show loading state while fetching (Mantine Loader component)
- Handle error states (show error message in modal)
- Cache response data to avoid refetching on re-open

**Performance requirement**: Modal must open within 500ms including data fetch

### 6. Accessibility Requirements

Implement the following a11y features:
- [ ] Modal traps focus while open (handled by Mantine Modal)
- [ ] Close button has accessible label: `aria-label="Close response details"`
- [ ] Modal announces opening to screen readers
- [ ] Star ratings have text alternatives: `aria-label="4 out of 5 stars - Satisfied"`
- [ ] Focus returns to "View" link/button that triggered modal on close
- [ ] All interactive elements keyboard accessible
- [ ] Proper heading hierarchy (use h2 for modal title, h3 for question numbers)

### 7. Styling Guidelines

**Colors** (Equal Experts branding):
- Primary Blue: `#1795d4`
- Navy: `#22567c`
- Charcoal: `#2c3234`

**Typography**:
- Font: Lexend (weights: 300, 400, 500)
- Question numbers: Bold or medium weight
- Question text: Regular weight
- Answers: Regular weight
- "No response": Italic, muted color

**Spacing**:
- Consistent vertical spacing between questions
- Adequate padding in modal body
- Clear visual separation between questions

### 8. Testing Checklist

**Functional tests**:
- [ ] Modal opens when clicking "View" on any response
- [ ] Modal displays correct response ID and timestamp
- [ ] All 19 questions render in correct order
- [ ] Likert questions show star ratings with labels
- [ ] Multi-select questions show bulleted lists
- [ ] Ranking questions show numbered lists
- [ ] Open-ended questions show quoted text with preserved line breaks
- [ ] Unanswered questions show "No response"
- [ ] Modal closes via X button
- [ ] Modal closes via overlay click
- [ ] Modal closes via Escape key
- [ ] Focus returns to "View" link on close
- [ ] Modal scrolls correctly when content exceeds viewport
- [ ] Header remains fixed while scrolling

**Non-functional tests**:
- [ ] Modal opens within 500ms
- [ ] Focus trap works correctly
- [ ] Screen reader announces modal opening
- [ ] All accessibility requirements met
- [ ] Responsive design works on mobile (375px) to desktop (1920px)

### 9. Technical Constraints

**Backend**:
- Follow NestJS module organization patterns
- Use DTOs with class-validator for API validation
- Use Prisma for database access (inject via PrismaModule)
- Never expose Prisma entities directly
- All configuration via ConfigModule (no direct process.env)

**Frontend**:
- Use functional components only
- TypeScript with explicit prop interfaces
- All side effects in useEffect with explicit dependencies
- No direct state mutations
- Mobile-first responsive design
- Mantine UI component library

**Database**:
- Use existing Prisma schema
- No schema changes required for this story
- Query should be efficient (single query with includes if needed)

## File Locations

**Backend**:
- Controller: `apps/backend/src/modules/survey/survey.controller.ts`
- Service: `apps/backend/src/modules/survey/survey.service.ts`
- DTOs: `apps/backend/src/modules/survey/dto/response-detail.dto.ts`

**Frontend**:
- Modal component: `apps/frontend/src/components/admin/ResponseDetailModal.tsx`
- Question formatter: `apps/frontend/src/components/admin/QuestionAnswer.tsx` (helper)
- Integration: `apps/frontend/src/pages/admin/AdminOverviewPage.tsx`

**Shared**:
- Types (if needed): `packages/shared/src/types/response.ts`

## Success Criteria

The implementation is complete when:
1. Clicking "View" on any response opens a modal with complete details
2. All 19 questions display with correct formatting for their type
3. Modal meets all accessibility requirements
4. Modal performs within 500ms load time
5. All three close methods work correctly
6. Focus management works as specified
7. All tests pass

## Questions to Resolve Before Implementation

- Is admin authentication implemented? If so, ensure endpoint is protected.
- What is the exact question text and type for all 19 questions? (Reference from database schema or existing survey form)
- Are there existing API endpoints to fetch responses that can be extended?
- Is React Query or another data fetching library already in use?
- Are there existing patterns for modals in the admin section to follow?
