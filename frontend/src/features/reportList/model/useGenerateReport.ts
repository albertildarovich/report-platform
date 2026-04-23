import { useState } from 'react';
import { reportTemplateApi } from '../../../entities/reportTemplate';

export const useGenerateReport = (onSuccess?: (runId: string) => void) => {
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async (reportId: string) => {
    setGeneratingId(reportId);
    setError(null);
    try {
      const result = await reportTemplateApi.generate(reportId);
      const runId = result.runId!;
      if (onSuccess) onSuccess(runId);
      return runId;
    } catch (err) {
      console.error('Failed to start generation:', err);
      setError('Failed to start report generation');
      throw err;
    } finally {
      setGeneratingId(null);
    }
  };

  return { generate, generatingId, error };
};