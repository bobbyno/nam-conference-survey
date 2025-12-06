import { useState, useEffect } from 'react';
import { Container, Stack, Title, SimpleGrid, Alert, Image, Group } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { MetricCard } from '../components/MetricCard';
import { RecentResponsesSection } from '../components/RecentResponsesSection';
import { ThemeToggle } from '../components/ThemeToggle';
import { ResponseDetailModal } from '../components/admin/ResponseDetailModal';
import { getAdminMetrics, getAdminRecentResponses } from '../api/admin';
import { AdminMetricsResponse, AdminRecentResponsesResponse } from '../types/admin';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetricsResponse | null>(null);
  const [recentResponses, setRecentResponses] = useState<AdminRecentResponsesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch both endpoints concurrently for optimal performance
        const [metricsData, responsesData] = await Promise.all([
          getAdminMetrics(),
          getAdminRecentResponses(),
        ]);

        setMetrics(metricsData);
        setRecentResponses(responsesData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleViewResponse = (responseId: string) => {
    setSelectedResponseId(responseId);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setSelectedResponseId(null);
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header with Logo */}
        <Stack gap="md" align="center">
          <Group justify="space-between" w="100%" style={{ position: 'relative' }}>
            <div style={{ width: 48 }} /> {/* Spacer for centering */}
            <Image
              src="https://www.equalexperts.com/wp-content/uploads/2024/10/2024-Logo.svg"
              alt="Equal Experts Logo"
              h={60}
              w="auto"
              fit="contain"
              style={{ margin: '0 auto' }}
            />
            <ThemeToggle size="md" />
          </Group>
          <Title order={1} ta="center" c="#22567c">
            Admin Dashboard
          </Title>
        </Stack>

        {/* Error State */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error Loading Dashboard"
            color="red"
            variant="filled"
          >
            {error}. Please try refreshing the page.
          </Alert>
        )}

        {/* Metrics Section */}
        <Stack gap="md">
          <Title order={2} size="h3" c="#2c3234">
            Survey Metrics
          </Title>
          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing="lg"
          >
            <MetricCard
              label="Completed"
              value={metrics?.completed ?? null}
              loading={loading}
              ariaLabel="Completed responses count"
            />
            <MetricCard
              label="In Progress"
              value={metrics?.inProgress ?? null}
              loading={loading}
              ariaLabel="In progress responses count"
            />
          </SimpleGrid>
        </Stack>

        {/* Recent Responses Section */}
        <RecentResponsesSection
          responses={recentResponses?.responses ?? null}
          loading={loading}
          onViewResponse={handleViewResponse}
        />

        {/* Response Detail Modal */}
        <ResponseDetailModal
          responseId={selectedResponseId}
          opened={modalOpened}
          onClose={handleCloseModal}
        />
      </Stack>
    </Container>
  );
}
