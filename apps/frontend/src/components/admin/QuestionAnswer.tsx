import { Text, List, Rating, Box, Stack } from '@mantine/core';
import { QuestionDetail } from '../../types/admin';

interface QuestionAnswerProps {
  question: QuestionDetail;
}

const LIKERT_LABELS: Record<number, string> = {
  5: 'Excellent',
  4: 'Good',
  3: 'Neutral',
  2: 'Fair',
  1: 'Poor',
};

const LIKERT_RETURN_LABELS: Record<number, string> = {
  5: 'Definitely yes',
  4: 'Probably yes',
  3: 'Unsure',
  2: 'Probably not',
  1: 'Definitely not',
};

const LIKERT_COWORKING_LABELS: Record<number, string> = {
  5: 'Extremely valuable',
  4: 'Very valuable',
  3: 'Moderately valuable',
  2: 'Slightly valuable',
  1: 'Not at all valuable',
};

const LIKERT_CONNECTION_LABELS: Record<number, string> = {
  5: 'Deep, meaningful professional relationships',
  4: 'Strong connections with potential for follow-up',
  3: 'Good conversations and exchanges',
  2: 'Mostly surface-level introductions',
  1: 'Minimal meaningful interaction',
};

const LIKERT_LEARNING_LABELS: Record<number, string> = {
  5: 'Excellent - learned significant new skills/knowledge',
  4: 'Good - learned useful things',
  3: 'Neutral - some learning but limited',
  2: 'Fair - minimal learning value',
  1: 'Poor - did not learn anything meaningful',
};

const LIKERT_SATURDAY_LABELS: Record<number, string> = {
  5: 'Absolutely worth it',
  4: 'Mostly worth it',
  3: 'Neutral',
  2: 'Questionable value for my time',
  1: 'Not worth my Saturday',
};

const LIKERT_COMMUNICATION_LABELS: Record<number, string> = {
  5: 'Very clear - knew exactly what to expect',
  4: 'Mostly clear',
  3: 'Somewhat clear',
  2: 'Unclear in some areas',
  1: 'Very unclear - arrived unsure what to expect',
};

const LIKERT_COMPARISON_LABELS: Record<number, string> = {
  5: 'Much better than other opportunities',
  4: 'Somewhat better',
  3: 'About the same',
  2: 'Somewhat worse',
  1: 'Much worse',
};

function getLikertLabel(questionNumber: number, value: number): string {
  switch (questionNumber) {
    case 2:
      return LIKERT_RETURN_LABELS[value] || 'Unknown';
    case 5:
      return LIKERT_CONNECTION_LABELS[value] || 'Unknown';
    case 6:
      return LIKERT_LEARNING_LABELS[value] || 'Unknown';
    case 9:
      return LIKERT_COMMUNICATION_LABELS[value] || 'Unknown';
    default:
      return LIKERT_LABELS[value] || 'Unknown';
  }
}

function getLikertWithNALabel(questionNumber: number, value: string): string {
  if (value === 'N/A') {
    if (questionNumber === 3) return 'N/A - Did not attend coworking day';
    if (questionNumber === 8) return 'N/A - Did not attend Saturday';
    if (questionNumber === 10) return 'N/A - Did not stay at conference hotel';
    if (questionNumber === 13) return 'N/A - Haven\'t attended other professional development events';
    return 'N/A';
  }

  const numValue = parseInt(value);
  if (questionNumber === 3) return LIKERT_COWORKING_LABELS[numValue] || 'Unknown';
  if (questionNumber === 8) return LIKERT_SATURDAY_LABELS[numValue] || 'Unknown';
  if (questionNumber === 13) return LIKERT_COMPARISON_LABELS[numValue] || 'Unknown';
  return LIKERT_LABELS[numValue] || 'Unknown';
}

const MULTISELECT_LABELS: Record<string, string> = {
  leadership: 'EE leadership team',
  associates: 'Fellow associates in general',
  technical_experts: 'Technical experts in specific areas',
  similar_challenges: 'People working on similar challenges',
  different_work: "People I wouldn't normally interact with in day-to-day work",
  public_summary: 'Public summary of all feedback shared with attendees',
  action_plan: 'Action plan showing what will change based on feedback',
  visible_changes: "Visible changes at next conference addressing this year's issues",
  direct_response: 'Direct response acknowledging my specific feedback',
  explain_decisions: 'Conference organizers explaining decisions and trade-offs',
  already_confident: 'Nothing - I already feel confident feedback is valued',
  other: 'Other',
};

const SINGLE_CHOICE_LABELS: Record<string, string> = {
  too_short: 'Too short - wanted more time',
  just_right: 'Just right',
  too_long: 'Too long - felt too much time commitment',
  unsure: 'Unsure',
  yes_clear: 'Yes - clear improvements',
  some: 'Some improvements noticed',
  no_changes: 'No noticeable changes',
  not_sure: "Not sure / can't remember specific improvements",
  did_not_attend: 'Did not attend last conference',
  first_conference: 'This is my first NAM Conference',
  employee: 'Employee',
  active_associate: 'Active Associate',
  alumni_associate: 'Alumni Associate',
  client: 'Client',
  prefer_not: 'Prefer not to answer',
};

const RANKING_LABELS: Record<string, string> = {
  presentations: 'Main presentations',
  workshops: 'Interactive workshops',
  coworking: 'Co-working time',
  networking: 'Networking / social time',
};

function renderLikertAnswer(questionNumber: number, value: number | null): JSX.Element {
  if (value === null) {
    return <Text fs="italic" c="dimmed">No response</Text>;
  }

  const label = getLikertLabel(questionNumber, value);

  return (
    <Box>
      <Rating value={value} count={5} readOnly size="lg" aria-label={`${value} out of 5 stars - ${label}`} />
      <Text size="sm" c="dimmed" mt={4}>({value} - {label})</Text>
    </Box>
  );
}

function renderLikertWithNAAnswer(questionNumber: number, value: string | null): JSX.Element {
  if (value === null) {
    return <Text fs="italic" c="dimmed">No response</Text>;
  }

  const label = getLikertWithNALabel(questionNumber, value);

  if (value === 'N/A') {
    return <Text>{label}</Text>;
  }

  const numValue = parseInt(value);

  return (
    <Box>
      <Rating value={numValue} count={5} readOnly size="lg" aria-label={`${numValue} out of 5 stars - ${label}`} />
      <Text size="sm" c="dimmed" mt={4}>({numValue} - {label})</Text>
    </Box>
  );
}

function renderMultiSelectAnswer(values: string[] | null): JSX.Element {
  if (!values || values.length === 0) {
    return <Text fs="italic" c="dimmed">No response</Text>;
  }

  return (
    <List>
      {values.map((value, index) => (
        <List.Item key={index}>
          {MULTISELECT_LABELS[value] || value}
        </List.Item>
      ))}
    </List>
  );
}

function renderRankingAnswer(rankings: Record<string, number> | null): JSX.Element {
  if (!rankings || Object.keys(rankings).length === 0) {
    return <Text fs="italic" c="dimmed">No response</Text>;
  }

  // Convert object to array and sort by rank
  const sortedRankings = Object.entries(rankings)
    .sort(([, rankA], [, rankB]) => rankA - rankB);

  return (
    <List type="ordered">
      {sortedRankings.map(([key]) => (
        <List.Item key={key}>
          {RANKING_LABELS[key] || key}
        </List.Item>
      ))}
    </List>
  );
}

function renderOpenEndedAnswer(value: string | null): JSX.Element {
  if (!value) {
    return <Text fs="italic" c="dimmed">No response</Text>;
  }

  return (
    <Box
      p="md"
      style={{
        backgroundColor: 'var(--mantine-color-gray-0)',
        borderLeft: '3px solid var(--mantine-color-gray-4)',
        whiteSpace: 'pre-wrap',
      }}
    >
      <Text>{value}</Text>
    </Box>
  );
}

function renderSingleChoiceAnswer(value: string | null): JSX.Element {
  if (!value) {
    return <Text fs="italic" c="dimmed">No response</Text>;
  }

  return <Text>{SINGLE_CHOICE_LABELS[value] || value}</Text>;
}

function renderTextFieldAnswer(value: { name: string | null; location: string | null }): JSX.Element {
  if (!value.name && !value.location) {
    return <Text fs="italic" c="dimmed">No response</Text>;
  }

  return (
    <Stack gap="xs">
      {value.name && <Text><strong>Name:</strong> {value.name}</Text>}
      {value.location && <Text><strong>Location:</strong> {value.location}</Text>}
    </Stack>
  );
}

export function QuestionAnswer({ question }: QuestionAnswerProps): JSX.Element {
  const { questionNumber, questionText, questionType, answer } = question;

  let answerContent: JSX.Element;

  switch (questionType) {
    case 'likert':
      answerContent = renderLikertAnswer(questionNumber, answer);
      break;
    case 'likert-with-na':
      answerContent = renderLikertWithNAAnswer(questionNumber, answer);
      break;
    case 'multiselect':
      answerContent = renderMultiSelectAnswer(answer);
      break;
    case 'ranking':
      answerContent = renderRankingAnswer(answer);
      break;
    case 'openended':
      answerContent = renderOpenEndedAnswer(answer);
      break;
    case 'single-choice':
      answerContent = renderSingleChoiceAnswer(answer);
      break;
    case 'text-field':
      answerContent = renderTextFieldAnswer(answer);
      break;
    default:
      answerContent = <Text fs="italic" c="dimmed">Unknown question type</Text>;
  }

  return (
    <Box mb="xl">
      <Text fw={600} size="md" mb="xs" c="#2c3234">
        Q{questionNumber}: {questionText}
      </Text>
      {answerContent}
    </Box>
  );
}
