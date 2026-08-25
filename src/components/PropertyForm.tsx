'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Property, PropertyStatus, PropertyType } from '@/lib/types';
import { PROPERTY_TYPE_LABEL, STATUS_LABEL } from '@/lib/types';

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
    area: property?.area?.toString() ?? '',
    bedrooms: property?.bedrooms?.toString() ?? '0',
    bathrooms: property?.bathrooms?.toString() ?? '0',
    property_type: (property?.property_type ?? 'nha') as PropertyType,
    status: (property?.status ?? 'ban') as PropertyStatus,
    address: property?.address ?? '',
    district: property?.district ?? '',
    province: property?.province ?? '',
    contact_name: property?.contact_name ?? '',
    contact_phone: property?.contact_phone ?? '',
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
    setImages((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      price: Number(form.price) || 0,
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
            Giá (VNĐ) * {form.status === 'thue' && <span style={{ fontWeight: 400 }}>— mỗi tháng</span>}
          </label>
          <input
            id="price"
            type="number"
            required
            min={0}
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            placeholder="4500000000"
          />
        </div>
        <div className="field">
          <label htmlFor="area">Diện tích (m²) *</label>
          <input
            id="area"
            type="number"
            required
            min={0}
            step="0.1"
            value={form.area}
            onChange={(e) => update('area', e.target.value)}
            placeholder="85"
          />
        </div>
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
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
            {images.map((url) => (
              <div key={url} style={{ position: 'relative' }}>
                <img
                  src={url}
                  alt=""
                  style={{
                    width: 96,
                    height: 72,
                    objectFit: 'cover',
                    borderRadius: 7,
                    border: '1px solid var(--border)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  aria-label="Xóa ảnh"
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    border: 'none',
                    background: '#b42318',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 13,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
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
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={saving}>
          Hủy
        </button>
      </div>
    </form>
  );
}
