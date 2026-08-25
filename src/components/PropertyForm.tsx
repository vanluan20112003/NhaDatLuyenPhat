'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Property, PropertyStatus, PropertyType } from '@/lib/types';
import { PROPERTY_TYPE_LABEL, STATUS_LABEL } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import {
  DEFAULT_CONTACT_NAME,
  DEFAULT_CONTACT_PHONE,
  DEFAULT_DISTRICT,
  DEFAULT_PROVINCE,
} from '@/lib/contact';

const BUCKET = 'property-images';

interface Props {
  /** Có giá trị = đang sửa; không có = đăng tin mới */
  property?: Property;
  onDone: (message: string) => void;
  onCancel: () => void;
}

export default function PropertyForm({ property, onDone, onCancel }: Props) {
  const isEdit = !!property;

  const [form, setForm] = useState({
    title: property?.title ?? '',
    description: property?.description ?? '',
    price: property?.price?.toString() ?? '',
    price_text: property?.price_text ?? '',
    area: property?.area?.toString() ?? '',
    bedrooms: property?.bedrooms?.toString() ?? '0',
    bathrooms: property?.bathrooms?.toString() ?? '0',
    property_type: (property?.property_type ?? 'nha') as PropertyType,
    status: (property?.status ?? 'ban') as PropertyStatus,
    address: property?.address ?? '',
    district: property?.district ?? DEFAULT_DISTRICT,
    province: property?.province ?? DEFAULT_PROVINCE,
    // Tin mới mặc định để thông tin công ty; sửa tin cũ thì giữ nguyên giá trị đã lưu
    contact_name: property?.contact_name ?? DEFAULT_CONTACT_NAME,
    contact_phone: property?.contact_phone ?? DEFAULT_CONTACT_PHONE,
    featured: property?.featured ?? false,
  });

  const [images, setImages] = useState<string[]>(property?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    const uploaded: string[] = [];

    for (const file of files) {
      // Tên file phải unique, giữ nguyên phần mở rộng
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file);
      if (upErr) {
        setError(`Upload "${file.name}" thất bại: ${upErr.message}`);
        break;
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    if (uploaded.length > 0) setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
    e.target.value = ''; // cho phép chọn lại cùng file
  }

  function removeImage(url: string) {
    const i = images.indexOf(url);
    const isCover = i === 0;
    const msg = isCover
      ? 'Xóa ảnh bìa? Ảnh kế tiếp sẽ thành ảnh bìa mới.'
      : 'Xóa ảnh này khỏi tin đăng?';
    if (!confirm(msg)) return;

    setImages((prev) => prev.filter((u) => u !== url));
  }

  /** Đưa ảnh thứ i lên đầu mảng -> thành ảnh bìa */
  function makeCover(i: number) {
    setImages((prev) => {
      const next = [...prev];
      const [pick] = next.splice(i, 1);
      return [pick, ...next];
    });
  }

  /** Đổi chỗ ảnh thứ i với ảnh liền kề, để sắp thứ tự hiển thị */
  function move(i: number, step: number) {
    setImages((prev) => {
      const j = i + step;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  /** Hủy giữa chừng thì hỏi lại, tránh mất công gõ */
  function handleCancel() {
    const touched =
      form.title.trim() ||
      form.description.trim() ||
      form.price.trim() ||
      form.area.trim() ||
      form.address.trim() ||
      images.length > 0;

    if (touched && !confirm('Hủy và bỏ mọi thay đổi chưa lưu?')) return;
    onCancel();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      price: Number(form.price) || 0,
      price_text: form.price_text.trim() || null,
      area: Number(form.area) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      property_type: form.property_type,
      status: form.status,
      address: form.address.trim() || null,
      district: form.district.trim() || null,
      province: form.province.trim() || null,
      contact_name: form.contact_name.trim() || null,
      contact_phone: form.contact_phone.trim() || null,
      featured: form.featured,
      images,
    };

    const { error } = isEdit
      ? await supabase.from('properties').update(payload).eq('id', property!.id)
      : await supabase.from('properties').insert(payload);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }
    onDone(isEdit ? 'Đã cập nhật tin đăng.' : 'Đã đăng tin mới.');
  }

  return (
    <form onSubmit={handleSubmit} className="panel">
      <h2>{isEdit ? 'Sửa tin đăng' : 'Đăng tin mới'}</h2>

      {error && <div className="alert alert-err">{error}</div>}

      <div className="field">
        <label htmlFor="title">Tiêu đề *</label>
        <input
          id="title"
          required
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Nhà phố 3 tầng mặt tiền..."
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="type">Loại hình *</label>
          <select
            id="type"
            value={form.property_type}
            onChange={(e) => update('property_type', e.target.value as PropertyType)}
          >
            {Object.entries(PROPERTY_TYPE_LABEL).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="status">Nhu cầu *</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => update('status', e.target.value as PropertyStatus)}
          >
            {Object.entries(STATUS_LABEL).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="price">
            Giá (VNĐ){' '}
            {form.status === 'thue' && <span style={{ fontWeight: 400 }}>— mỗi tháng</span>}
          </label>
          <input
            id="price"
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            placeholder="Bỏ trống cũng được"
          />
          <small style={{ color: 'var(--text-dim)', fontSize: 12.5 }}>
            Chỉ dùng để lọc theo khoảng giá ở trang chủ. Bỏ trống thì tin vẫn
            đăng được, chỉ là không lọt vào bộ lọc giá.
          </small>
        </div>
        <div className="field">
          <label htmlFor="area">Diện tích (m²)</label>
          <input
            id="area"
            type="number"
            min={0}
            step="0.1"
            value={form.area}
            onChange={(e) => update('area', e.target.value)}
            placeholder="Bỏ trống cũng được"
          />
          <small style={{ color: 'var(--text-dim)', fontSize: 12.5 }}>
            Bỏ trống thì web không hiện dòng diện tích.
          </small>
        </div>
      </div>

      <div className="field">
        <label htmlFor="price_text">Giá hiển thị trên web</label>
        <input
          id="price_text"
          value={form.price_text}
          onChange={(e) => update('price_text', e.target.value)}
          placeholder="Ví dụ: 8xx triệu / Thương lượng / 4,5 tỷ"
        />
        <small style={{ color: 'var(--text-dim)', fontSize: 12.5 }}>
          Đây là dòng giá khách nhìn thấy. Để trống thì web tự tính từ ô Giá ở trên (
          {form.price ? formatPrice(Number(form.price), form.status) : '…'}).
        </small>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="bedrooms">Số phòng ngủ</label>
          <input
            id="bedrooms"
            type="number"
            min={0}
            value={form.bedrooms}
            onChange={(e) => update('bedrooms', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="bathrooms">Số phòng tắm</label>
          <input
            id="bathrooms"
            type="number"
            min={0}
            value={form.bathrooms}
            onChange={(e) => update('bathrooms', e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="address">Địa chỉ</label>
        <input
          id="address"
          value={form.address}
          onChange={(e) => update('address', e.target.value)}
          placeholder="123 Nguyễn Văn Cừ"
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="district">Quận / Huyện</label>
          <input
            id="district"
            value={form.district}
            onChange={(e) => update('district', e.target.value)}
            placeholder="Quận 5"
          />
        </div>
        <div className="field">
          <label htmlFor="province">Tỉnh / Thành phố</label>
          <input
            id="province"
            value={form.province}
            onChange={(e) => update('province', e.target.value)}
            placeholder="TP. Hồ Chí Minh"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Mô tả</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Nhà mới xây, sổ hồng riêng..."
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="contact_name">Người liên hệ</label>
          <input
            id="contact_name"
            value={form.contact_name}
            onChange={(e) => update('contact_name', e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="contact_phone">Điện thoại liên hệ</label>
          <input
            id="contact_phone"
            value={form.contact_phone}
            onChange={(e) => update('contact_phone', e.target.value)}
            placeholder="0901234567"
          />
        </div>
      </div>

      {/* ---------- Ảnh ---------- */}
      <div className="field">
        <label htmlFor="images">Hình ảnh</label>
        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
        />
        {uploading && (
          <div style={{ fontSize: 13.5, color: 'var(--text-dim)', marginTop: 6 }}>
            Đang tải ảnh lên...
          </div>
        )}

        {images.length > 0 && (
          <>
            <p className="img-hint">
              Ảnh đầu tiên là <b>ảnh bìa</b> — ảnh hiển thị ngoài trang chủ.
              Bấm &quot;Đặt làm bìa&quot; để đổi.
            </p>
            <div className="img-grid">
              {images.map((url, i) => (
                <div key={url} className={`img-item${i === 0 ? ' is-cover' : ''}`}>
                  <img src={url} alt="" />

                  {i === 0 && <span className="img-cover-tag">Ảnh bìa</span>}

                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    aria-label="Xóa ảnh"
                    className="img-del"
                  >
                    ×
                  </button>

                  <div className="img-tools">
                    {i > 0 && (
                      <button type="button" onClick={() => makeCover(i)} title="Đặt làm ảnh bìa">
                        Đặt làm bìa
                      </button>
                    )}
                    {i > 0 && (
                      <button type="button" onClick={() => move(i, -1)} aria-label="Chuyển lên trước">
                        ‹
                      </button>
                    )}
                    {i < images.length - 1 && (
                      <button type="button" onClick={() => move(i, 1)} aria-label="Chuyển ra sau">
                        ›
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="field">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update('featured', e.target.checked)}
            style={{ width: 'auto' }}
          />
          Đánh dấu tin nổi bật (hiển thị lên đầu trang chủ)
        </label>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button type="submit" className="btn" disabled={saving || uploading}>
          {saving ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Đăng tin'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={handleCancel} disabled={saving}>
          Hủy
        </button>
      </div>
    </form>
  );
}
