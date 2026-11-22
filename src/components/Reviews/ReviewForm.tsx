import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/utils/hooks/useI18n';

const FILE_KIND: Record<string, 'image' | 'video'> = {
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  webp: 'image',
  mp4: 'video',
  webm: 'video',
  ogg: 'video',
  mov: 'video',
  mpeg: 'video',
  mpg: 'video',
  avi: 'video',
};

const DEFAULT_LIMITS = { maxFiles: 5, maxFileSizeMb: 25 };

type PendingFile = { file: File; url: string };

function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));
}

function fileKind(file: File): 'image' | 'video' | null {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  return FILE_KIND[ext] || null;
}

const ReviewForm: React.FC<{ productId: number; onSubmit: () => void; onCancel: () => void }> = ({
  productId,
  onSubmit,
  onCancel,
}) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
    rating: 5,
    consent: false,
  });
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [attachments, setAttachments] = useState<PendingFile[]>([]);
  const [attachmentError, setAttachmentError] = useState<string>('');
  const [limits, setLimits] = useState(DEFAULT_LIMITS);
  const [submitting, setSubmitting] = useState(false);
  const attachmentsRef = useRef<PendingFile[]>([]);
  attachmentsRef.current = attachments;

  const handleStarClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/api/reviews?limits=1')
      .then((response) => response.json())
      .then((data) => {
        if (cancelled || !data?.maxFiles || !data?.maxFileSizeMb) return;
        setLimits({ maxFiles: Number(data.maxFiles), maxFileSizeMb: Number(data.maxFileSizeMb) });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => () => {
    attachmentsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachmentError('');
    e.currentTarget.value = '';
    if (!files.length) return;

    const maxBytes = limits.maxFileSizeMb * 1024 * 1024;
    const accepted: PendingFile[] = [];
    let message = '';
    for (const file of files) {
      if (attachments.length + accepted.length >= limits.maxFiles) {
        message = fill(t.reviews.tooManyFiles, { count: limits.maxFiles });
        break;
      }
      if (!fileKind(file)) {
        message = t.reviews.onlyImages;
        continue;
      }
      if (file.size > maxBytes) {
        message = fill(t.reviews.maxFileSize, { size: limits.maxFileSizeMb });
        continue;
      }
      accepted.push({ file, url: URL.createObjectURL(file) });
    }
    setAttachmentError(message);
    if (accepted.length > 0) {
      setAttachments((current) => [...current, ...accepted].slice(0, limits.maxFiles));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((current) => {
      const removed = current[index];
      if (removed) URL.revokeObjectURL(removed.url);
      return current.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const uploadAttachments = async () => {
    const tokenResponse = await fetch('/api/reviews?uploadToken=1', { method: 'POST' });
    const tokenData = await tokenResponse.json().catch(() => ({}));
    if (!tokenResponse.ok || !tokenData.token || !tokenData.uploadUrl) {
      const unavailable = new Error(t.reviews.mediaUnavailable) as Error & { code?: string };
      unavailable.code = tokenData.code || 'media_unavailable';
      throw unavailable;
    }

    const ids: number[] = [];
    for (const item of attachments) {
      const body = new FormData();
      body.append('file', item.file);
      body.append('token', tokenData.token);
      const uploadResponse = await fetch(tokenData.uploadUrl, {
        method: 'POST',
        body,
      });
      const uploadData = await uploadResponse.json().catch(() => ({}));
      if (!uploadResponse.ok || !uploadData.id) {
        const failed = new Error(
          uploadResponse.status === 404 ? t.reviews.mediaUnavailable : t.reviews.reviewError,
        ) as Error & { code?: string };
        failed.code = uploadData.code || uploadData.data?.code || (uploadResponse.status === 404 ? 'media_unavailable' : 'upload_failed');
        throw failed;
      }
      ids.push(Number(uploadData.id));
    }

    return { ids, token: tokenData.token as string };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const errors: { [k: string]: string } = {};
    if (!formData.name.trim()) errors.name = t.reviews.fillName;
    if (!formData.email.trim()) errors.email = t.reviews.fillEmail;
    if (!formData.content.trim()) errors.content = t.reviews.writeReview;
    if (!formData.consent) errors.consent = t.reviews.mustAcceptConsent;
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setError('');
    setSubmitting(true);

    try {
      let attachmentIds: number[] = [];
      let uploadToken = '';
      if (attachments.length > 0) {
        const uploaded = await uploadAttachments();
        attachmentIds = uploaded.ids;
        uploadToken = uploaded.token;
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          name: formData.name,
          email: formData.email,
          content: formData.content,
          rating: formData.rating,
          attachmentIds,
          uploadToken,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.code === 'media_unavailable') {
          throw new Error(t.reviews.mediaUnavailable);
        }
        throw new Error(t.reviews.reviewError);
      }
      onSubmit();
    } catch (submitError) {
      console.error('Error submitting review:', submitError);
      setError(submitError instanceof Error ? submitError.message : t.reviews.reviewError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative bg-white w-full p-6 rounded-[24px] shadow-lg"
    >
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-700"
        aria-label={t.common.close}
      >
        &times;
      </button>
      <h3 className="text-xl font-bold mb-6">{t.reviews.addYourReview}</h3>
      <div className="flex items-center mb-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(index + 1)}
              className={`text-lg ${formData.rating > index
                ? 'text-dark-pastel-red'
                : 'text-gray-300'
                } hover:text-dark-pastel-red transition-colors`}
            >
              ★
            </button>
          ))}
        </div>
        <span className="ml-2 text-lg font-medium">{formData.rating}/5</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Name Field */}
        <div className="flex flex-col">
          <input
            type="text"
            placeholder={t.form.firstName}
            className={`border-b ${fieldErrors.name
              ? 'border-[#A83232]'
              : 'border-gray-300'} focus:border-black outline-none px-2 py-2 w-full`}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {fieldErrors.name && (
            <div className="flex items-center text-[#A83232] text-sm mt-1">
              <img src="/icons/Warning_Circle_Warning.svg" alt="Warning" className="w-4 h-4 mr-2" />
              <span>{fieldErrors.name}</span>
            </div>
          )}
        </div>
        {/* Email Field */}
        <div className="flex flex-col">
          <input
            type="email"
            placeholder={t.form.email}
            className={`border-b ${fieldErrors.email
              ? 'border-[#A83232]'
              : 'border-gray-300'} focus:border-black outline-none px-2 py-2 w-full`}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {fieldErrors.email && (
            <div className="flex items-center text-[#A83232] text-sm mt-1">
              <img src="/icons/Warning_Circle_Warning.svg" alt="Warning" className="w-4 h-4 mr-2" />
              <span>{fieldErrors.email}</span>
            </div>
          )}
        </div>
      </div>
      <textarea
        placeholder={t.reviews.writeReview}
        className={`border-b ${fieldErrors.content ? 'border-[#A83232]' : 'border-gray-300'} focus:border-black outline-none w-full px-2 py-2 mb-6`}
        rows={4}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
      />
      {fieldErrors.content && (
        <div className="flex items-center text-[#A83232] text-sm mb-6 -mt-4">
          <img src="/icons/Warning_Circle_Warning.svg" alt="Warning" className="w-4 h-4 mr-2" />
          <span>{fieldErrors.content}</span>
        </div>
      )}
      {/* Załączniki (opcjonalne) */}
      <div className="mt-2">
        <label className="block text-sm mb-1">{t.reviews.attachments}</label>
        <p className="text-sm text-gray-500 mb-2">
          {fill(t.reviews.attachmentsHint, { count: limits.maxFiles, size: limits.maxFileSizeMb })}
        </p>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/ogg,video/quicktime,video/mpeg,.avi"
            multiple
            onChange={handleFileChange}
            className="text-sm"
          />
        </div>
        {attachmentError && (
          <div className="flex items-center text-[#A83232] text-sm mt-1">
            <img src="/icons/Warning_Circle_Warning.svg" alt="Warning" className="w-4 h-4 mr-2" />
            <span>{attachmentError}</span>
          </div>
        )}
      </div>
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm text-neutral-darkest mt-2">
          {attachments.map((item, idx) => (
            <div key={item.url} className="relative">
              {fileKind(item.file) === 'video' ? (
                <video src={item.url} muted playsInline preload="metadata" className="w-14 h-14 object-cover rounded-md bg-neutral-200" />
              ) : (
                <img src={item.url} alt={`${t.reviews.preview} ${idx + 1}`} className="w-14 h-14 object-cover rounded-md" />
              )}
              <button
                type="button"
                onClick={() => removeAttachment(idx)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white"
                aria-label={t.reviews.removeFile}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Styled Checkbox */}
      <div className="mt-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(e) =>
              setFormData({ ...formData, consent: e.target.checked })
            }
            className="hidden"
          />
          <span
            className={`w-12 h-5 md:w-5 flex items-center justify-center border rounded ${formData.consent ? 'bg-black text-white' : 'border-black'
              }`}
          >
            {formData.consent && <img src="/icons/check.svg" alt="check" />}
          </span>
          <span>
            {t.reviews.consentText.split('Regulaminu')[0]}
            <Link className="underline" href="/regulamin">
              {t.legal.terms}
            </Link>
            {' i '}
            <Link className="underline" href="/polityka-prywatnosci">
              {t.legal.privacy}
            </Link>
            {t.reviews.consentText.split('Polityki Prywatności')[1] || ` ${t.checkout.terms.accept}`}
          </span>
        </label>
        {fieldErrors.consent && (
          <div className="flex items-center text-[#A83232] text-sm mt-1">
            <img src="/icons/Warning_Circle_Warning.svg" alt="Warning" className="w-4 h-4 mr-2" />
            <span>{fieldErrors.consent}</span>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center text-[#A83232] text-sm mt-6">
          <img src="/icons/Warning_Circle_Warning.svg" alt="Warning" className="w-4 h-4 mr-2" />
          <span>{error}</span>
        </div>
      )}
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={submitting}
          className="px-[75px] font-light py-3 bg-black text-white rounded-full hover:bg-dark-pastel-red transition-all disabled:opacity-60"
        >
          {submitting ? t.reviews.sending : t.reviews.addReview}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
