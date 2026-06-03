import { useState } from 'react';
import { assertSafeText } from '@/lib/safeText';
import { ApiErrorCode } from '@/types/api';
import { ApiError, improveComment } from '@/api/client';
import styles from './AiCommentHelper.module.scss';

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
      <div className="stack-row">
        <button
          type="button"
          className="btn btn--secondary"
          disabled={!canImprove || loading}
          onClick={handleImprove}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              AI…
            </>
          ) : (
            'Улучшить комментарий с AI'
          )}
        </button>
      </div>

      {error && (
        <div className={styles.errorWrap}>
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        </div>
      )}

      {preview && (
        <div className={styles.preview}>
          <p className="text-small">Предпросмотр:</p>
          <p className="text-body">{preview}</p>
          <div className="stack-row">
            <button
              type="button"
              className="btn"
              onClick={() => {
                onAccept(preview);
                setPreview(null);
              }}
            >
              Принять
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setPreview(null)}>
              Отклонить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
