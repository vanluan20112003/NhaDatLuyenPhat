'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  /** Gắn liên hệ với một tin đăng cụ thể */
  propertyId?: number;
  /** Bỏ bớt field khi nhúng trong sidebar trang chi tiết */
  compact?: boolean;
}

export default function ContactForm({ propertyId, compact = false }: Props) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setResult(null);

    const { error } = await supabase.from('contacts').insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      message: form.message.trim() || null,
      property_id: propertyId ?? null,
    });

    if (error) {
      setResult({ ok: false, text: `Gửi không thành công: ${error.message}` });
    } else {
      setResult({ ok: true, text: 'Đã gửi! Chúng tôi sẽ liên hệ lại với bạn sớm.' });
      setForm({ name: '', phone: '', email: '', message: '' });
    }
    setSending(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      {result && (
        <div className={`alert ${result.ok ? 'alert-ok' : 'alert-err'}`}>{result.text}</div>
      )}

      <div className="field">
        <label htmlFor="cf-name">Họ và tên *</label>
        <input
          id="cf-name"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div className="field">
        <label htmlFor="cf-phone">Số điện thoại *</label>
        <input
          id="cf-phone"
          required
          type="tel"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="09xx xxx xxx"
        />
      </div>

      {!compact && (
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="email@example.com"
          />
        </div>
      )}

      <div className="field">
        <label htmlFor="cf-msg">Nội dung</label>
        <textarea
          id="cf-msg"
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder={
            propertyId ? 'Tôi quan tâm tin đăng này, vui lòng liên hệ tư vấn.' : 'Bạn cần hỗ trợ gì?'
          }
          style={compact ? { minHeight: 72 } : undefined}
        />
      </div>

      <button type="submit" className="btn" disabled={sending} style={{ width: '100%' }}>
        {sending ? 'Đang gửi...' : 'Gửi yêu cầu'}
      </button>
    </form>
  );
}
