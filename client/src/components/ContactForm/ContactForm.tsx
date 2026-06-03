import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';
import { ApiErrorCode } from '@developer-landing/shared';
import {
  Alert,
  Button,
  FormField,
  Input,
  TextArea,
} from '../../ui-kit';
import { contactSchema, type ContactFormData } from '../../schemas/contact';
import { ApiError, submitContact } from '../../api/client';
import { AiCommentHelper } from '../AiCommentHelper/AiCommentHelper';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: 520px;
`;

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { website: '' },
  });

  const comment = watch('comment') ?? '';

  async function onSubmit(data: ContactFormData) {
    setStatus('loading');
    setGlobalError(null);
    try {
      await submitContact({
        name: data.name,
        phone: data.phone,
        email: data.email,
        comment: data.comment,
        website: data.website,
      });
      setStatus('success');
      reset({ name: '', phone: '', email: '', comment: '', website: '' } as ContactFormData);
    } catch (e) {
      setStatus('error');
      if (e instanceof ApiError) {
        if (e.code === ApiErrorCode.ContentPolicyViolation) {
          setGlobalError('Текст не прошёл проверку безопасности');
        } else if (e.code === ApiErrorCode.DeliveryFailed) {
          setGlobalError('Не удалось отправить сообщение. Попробуйте позже.');
        } else if (e.code === ApiErrorCode.RateLimitExceeded) {
          setGlobalError('Слишком много попыток. Подождите минуту.');
        } else if (e.details?.length) {
          setGlobalError(e.details.map((d) => d.message).join('. '));
        } else {
          setGlobalError(e.message);
        }
      } else {
        setGlobalError('Ошибка сети. Проверьте подключение.');
      }
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="Имя" htmlFor="name" error={errors.name?.message}>
        <Input id="name" {...register('name')} error={!!errors.name} />
      </FormField>

      <FormField label="Телефон" htmlFor="phone" error={errors.phone?.message}>
        <Input id="phone" type="tel" {...register('phone')} error={!!errors.phone} />
      </FormField>

      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" {...register('email')} error={!!errors.email} />
      </FormField>

      <FormField label="Комментарий" htmlFor="comment" error={errors.comment?.message}>
        <TextArea id="comment" rows={5} {...register('comment')} error={!!errors.comment} />
      </FormField>

      <AiCommentHelper draft={comment} onAccept={(text) => setValue('comment', text, { shouldValidate: true })} />

      <FormField honeypot>
        <Input tabIndex={-1} autoComplete="off" aria-hidden="true" {...register('website')} />
      </FormField>

      {status === 'success' && (
        <Alert variant="success">Сообщение отправлено! Проверьте почту — мы отправили копию.</Alert>
      )}

      {status === 'error' && globalError && <Alert variant="error">{globalError}</Alert>}

      <Button type="submit" loading={status === 'loading'} fullWidth disabled={status === 'success'}>
        Отправить
      </Button>
    </Form>
  );
}
