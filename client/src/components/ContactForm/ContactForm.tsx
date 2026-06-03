import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resolveContactSubmitError } from '@/lib/contactFormErrors';
import { FORM_STATUS, type FormStatus } from '@/types/form';
import {
  Alert,
  Button,
  FormField,
  Input,
  TextArea,
} from '@/ui-kit';
import { contactSchema, type ContactFormData } from '@/schemas/contact';
import { submitContact } from '@/api/client';
import { AiCommentHelper } from '@/components/AiCommentHelper/AiCommentHelper';
import { Form } from './ContactForm.styles';

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>(FORM_STATUS.Idle);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { website: '' },
  });

  const comment = watch('comment') ?? '';

  async function onSubmit(data: ContactFormData) {
    setStatus(FORM_STATUS.Loading);
    setGlobalError(null);
    try {
      await submitContact({
        name: data.name,
        phone: data.phone,
        email: data.email,
        comment: data.comment,
        website: data.website,
      });
      setStatus(FORM_STATUS.Success);
      reset({ name: '', phone: '', email: '', comment: '', website: '' } as ContactFormData);
    } catch (e) {
      setStatus(FORM_STATUS.Error);
      const message = resolveContactSubmitError(e, setError);
      if (message) setGlobalError(message);
    }
  }

  return (
    <Form as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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

      {status === FORM_STATUS.Success && (
        <Alert variant="success">Сообщение отправлено! Проверьте почту — мы отправили копию.</Alert>
      )}

      {status === FORM_STATUS.Error && globalError && <Alert variant="error">{globalError}</Alert>}

      <Button
        type="submit"
        loading={status === FORM_STATUS.Loading}
        fullWidth
        disabled={status === FORM_STATUS.Success}
      >
        Отправить
      </Button>
    </Form>
  );
}
