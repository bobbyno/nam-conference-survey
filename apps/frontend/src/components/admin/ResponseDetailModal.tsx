import { useEffect, useState } from 'react';
import { Modal, Stack, Text, Loader, Alert, ScrollArea } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { ResponseDetail } from '../../types/admin';
import { getResponseDetail } from '../../api/admin';
import { QuestionAnswer } from './QuestionAnswer';

export interface ResponseDetailModalProps {
  responseId: string | null;
  opened: boolean;
  onClose: () => void;
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-US', options)
    .format(date)
    .replace(',', '')
    .toLowerCase()
    .replace(/\s([ap]m)$/, '$1');
}

function formatResponseId(id: string): string {
  return `#${id.substring(0, 8)}`;
}

export function ResponseDetailModal({ responseId, opened, onClose }: ResponseDetailModalProps) {
  const [response, setResponse] = useState<ResponseDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResponse() {
      if (!responseId || !opened) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getResponseDetail(responseId);
        setResponse(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load response details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchResponse();
  }, [responseId, opened]);

  const handleClose = () => {
    setResponse(null);
    setError(null);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        response ? (
          <Stack gap={4}>
            <Text fw={600} size="lg">
              Response {formatResponseId(response.id)}
            </Text>
            <Text size="sm" c="dimmed">
              Submitted: {formatTimestamp(response.submittedAt)}
            </Text>
          </Stack>
        ) : (
          <Text fw={600} size="lg">
            Loading Response...
          </Text>
        )
      }
      size={600}
      centered
      closeButtonProps={{
        'aria-label': 'Close response details',
      }}
      trapFocus
      styles={{
        body: {
          maxHeight: 'calc(80vh - 120px)',
        },
      }}
    >
      {loading && (
        <Stack align="center" py="xl">
          <Loader size="lg" />
          <Text c="dimmed">Loading response details...</Text>
        </Stack>
      )}

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          variant="filled"
        >
          {error}
        </Alert>
      )}

      {!loading && !error && response && (
        <ScrollArea h="calc(80vh - 120px)" type="auto">
          <Stack gap="lg" pr="md">
            {response.questions.map((question) => (
              <QuestionAnswer key={question.questionNumber} question={question} />
            ))}
          </Stack>
        </ScrollArea>
      )}
    </Modal>
  );
}
