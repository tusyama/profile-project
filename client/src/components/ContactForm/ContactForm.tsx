import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resolveContactSubmitError } from '@/lib/contactFormErrors';
import { FORM_STATUS, type FormStatus } from '@/types/form';
import { FormField } from '@/components/FormField/FormField';
import { contactSchema, type ContactFormData } from '@/schemas/contact';
import { submitContact } from '@/api/client';
import { AiCommentHelper } from '@/components/AiCommentHelper/AiCommentHelper';
import styles from './ContactForm.module.scss';

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

  const inputClass = (hasError: boolean) => (hasError ? 'input input--error' : 'input');

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="Имя" htmlFor="name" error={errors.name?.message}>
        <input id="name" className={inputClass(!!errors.name)} {...register('name')} />
      </FormField>

      <FormField label="Телефон" htmlFor="phone" error={errors.phone?.message}>
        <input
          id="phone"
          type="tel"
          className={inputClass(!!errors.phone)}
          {...register('phone')}
        />
      </FormField>

      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          className={inputClass(!!errors.email)}
          {...register('email')}
        />
      </FormField>

      <FormField label="Комментарий" htmlFor="comment" error={errors.comment?.message}>
        <textarea
          id="comment"
          rows={5}
          className={errors.comment ? 'textarea input--error' : 'textarea'}
          {...register('comment')}
        />
      </FormField>

      <AiCommentHelper
        draft={comment}
        onAccept={(text) => setValue('comment', text, { shouldValidate: true })}
      />

      <FormField honeypot>
        <input tabIndex={-1} autoComplete="off" aria-hidden="true" {...register('website')} />
      </FormField>

      {status === FORM_STATUS.Success && (
        <div className="alert alert--success" role="alert">
          Сообщение отправлено! Проверьте почту — мы отправили копию.
        </div>
      )}

      {status === FORM_STATUS.Error && globalError && (
        <div className="alert alert--error" role="alert">
          {globalError}
        </div>
      )}

      <button
        type="submit"
        className="btn btn--full"
        disabled={status === FORM_STATUS.Loading || status === FORM_STATUS.Success}
      >
        {status === FORM_STATUS.Loading ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Отправка…
          </>
        ) : (
          'Отправить'
        )}
      </button>
    </form>
  );
}
