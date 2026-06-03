import { useState } from 'react';
import { assertSafeText, ApiErrorCode } from '@developer-landing/shared';
import { Alert, Button, Text } from '@/ui-kit';
import { ApiError, improveComment } from '@/api/client';
import { ErrorWrap, Preview, Row } from './AiCommentHelper.styles';

interface Props {
  draft: string;
  onAccept: (text: string) => void;
}

export function AiCommentHelper({ draft, onAccept }: Props) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canImprove = draft.length >= 10 && assertSafeText(draft, 'strict', 2000).ok;

  async function handleImprove() {
    setError(null);
    setPreview(null);
    setLoading(true);
    try {
      const { improved } = await improveComment(draft);
      setPreview(improved);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.code === ApiErrorCode.ContentPolicyViolation) {
          setError('Текст не прошёл проверку безопасности');
        } else if (e.code === ApiErrorCode.RateLimitExceeded) {
          setError('Слишком много запросов. Попробуйте позже.');
        } else {
          setError('AI временно недоступен. Отправьте сообщение без улучшения.');
        }
      } else {
        setError('AI временно недоступен. Отправьте сообщение без улучшения.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Row>
        <Button
          type="button"
          variant="secondary"
          loading={loading}
          disabled={!canImprove}
          onClick={handleImprove}
        >
          Улучшить комментарий с AI
        </Button>
      </Row>

      {error && (
        <ErrorWrap>
          <Alert variant="error">{error}</Alert>
        </ErrorWrap>
      )}

      {preview && (
        <Preview>
          <Text $variant="small">Предпросмотр:</Text>
          <Text $variant="body">{preview}</Text>
          <Row>
            <Button type="button" onClick={() => { onAccept(preview); setPreview(null); }}>
              Принять
            </Button>
            <Button type="button" variant="ghost" onClick={() => setPreview(null)}>
              Отклонить
            </Button>
          </Row>
        </Preview>
      )}
    </div>
  );
}
