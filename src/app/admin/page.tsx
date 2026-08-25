'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Property } from '@/lib/types';
import { PROPERTY_TYPE_LABEL, STATUS_LABEL } from '@/lib/types';
import { displayPrice, formatDate } from '@/lib/format';
import PropertyForm from '@/components/PropertyForm';

interface Contact {
  id: number;
  name: string;
  phone: string;
  message: string | null;
  property_id: number | null;
  is_read: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (checking) return <div className="spinner" />;
  if (!session) return <LoginForm />;
  return <Dashboard email={session.user.email ?? ''} />;
}

/* ------------------------------------------------------------------ */

/** Username hợp lệ: chữ, số, gạch dưới, chấm — khớp ràng buộc phía database */
const USERNAME_RE = /^[a-zA-Z0-9_.]{3,32}$/;

function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const input = identifier.trim();
    let email = input;

    // Không có "@" thì coi là username, tra email tương ứng qua RPC.
    if (!input.includes('@')) {
      if (!USERNAME_RE.test(input)) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng.');
        setBusy(false);
        return;
      }

      const { data, error: rpcError } = await supabase.rpc('email_for_username', {
        p_username: input,
      });

      if (rpcError) {
        setError('Không kết nối được máy chủ. Thử lại sau.');
        setBusy(false);
        return;
      }
      if (!data) {
        // Báo lỗi chung để người ngoài không dò được username nào có thật
        setError('Tên đăng nhập hoặc mật khẩu không đúng.');
        setBusy(false);
        return;
      }
      email = data as string;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Tên đăng nhập hoặc mật khẩu không đúng.'
          : error.message
      );
    }
    setBusy(false);
  }

  return (
    <div className="container" style={{ maxWidth: 400, padding: '56px 16px' }}>
      <div className="panel">
        <h2>Đăng nhập quản trị</h2>
        {error && <div className="alert alert-err">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="field">
            <label htmlFor="identifier">Tên đăng nhập hoặc Email</label>
            <input
              id="identifier"
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              maxLength={254}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <button className="btn" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type Tab = 'properties' | 'contacts';

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Property | null>(null);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [propsRes, contactsRes] = await Promise.all([
      supabase.from('properties').select('*').order('created_at', { ascending: false }),
      supabase.from('contacts').select('*').order('created_at', { ascending: false }),
    ]);
    setProperties((propsRes.data ?? []) as Property[]);
    setContacts((contactsRes.data ?? []) as Contact[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(p: Property) {
    if (!confirm(`Xóa tin "${p.title}"? Thao tác này không hoàn tác được.`)) return;

    const { error } = await supabase.from('properties').delete().eq('id', p.id);
    if (error) {
      setNotice({ ok: false, text: `Xóa thất bại: ${error.message}` });
    } else {
      setNotice({ ok: true, text: 'Đã xóa tin đăng.' });
      load();
    }
  }

  const unread = contacts.filter((c) => !c.is_read).length;

  /** Mở tab Liên hệ thì đánh dấu tất cả là đã xem, badge tắt đi */
  async function markAllRead() {
    const ids = contacts.filter((c) => !c.is_read).map((c) => c.id);
    if (ids.length === 0) return;

    // Cập nhật ngay trên giao diện cho mượt, DB chạy nền
    setContacts((prev) => prev.map((c) => ({ ...c, is_read: true })));
    await supabase.from('contacts').update({ is_read: true }).in('id', ids);
  }

  async function handleDeleteContact(c: Contact) {
    if (!confirm(`Xóa liên hệ của ${c.name}?`)) return;
    const { error } = await supabase.from('contacts').delete().eq('id', c.id);
    if (error) setNotice({ ok: false, text: `Xóa thất bại: ${error.message}` });
    else load();
  }

  if (creating || editing) {
    return (
      <div className="container" style={{ maxWidth: 780, padding: '24px 16px 56px' }}>
        <PropertyForm
          property={editing ?? undefined}
          onDone={(msg) => {
            setCreating(false);
            setEditing(null);
            setNotice({ ok: true, text: msg });
            load();
          }}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '24px 16px 56px' }}>
      <div className="admin-head">
        <h2>Bảng điều khiển</h2>
        <div className="admin-head-actions">
          <Link href="/" className="btn btn-ghost btn-sm">
            ← Xem trang web
          </Link>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => supabase.auth.signOut()}
          >
            Đăng xuất
          </button>
        </div>
      </div>
      <p className="admin-user">Đang đăng nhập: {email}</p>

      {notice && (
        <div className={`alert ${notice.ok ? 'alert-ok' : 'alert-err'}`}>{notice.text}</div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button
          className={`btn ${tab === 'properties' ? '' : 'btn-ghost'}`}
          onClick={() => setTab('properties')}
        >
          Tin đăng ({properties.length})
        </button>
        <button
          className={`btn ${tab === 'contacts' ? '' : 'btn-ghost'}`}
          onClick={() => {
            setTab('contacts');
            markAllRead();
          }}
          style={{ position: 'relative' }}
        >
          Yêu cầu tư vấn ({contacts.length})
          {unread > 0 && <span className="tab-badge">{unread}</span>}
        </button>
        {tab === 'properties' && (
          <button className="btn" onClick={() => setCreating(true)} style={{ marginLeft: 'auto' }}>
            + Đăng tin mới
          </button>
        )}
      </div>

      {loading && <div className="spinner" />}

      {!loading && tab === 'properties' && (
        <div className="panel table-wrap">
          {properties.length === 0 ? (
            <div className="empty" style={{ border: 'none' }}>
              Chưa có tin đăng nào.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ width: 76 }}>Ảnh</th>
                  <th>Tiêu đề</th>
                  <th>Loại</th>
                  <th>Giá</th>
                  <th>Khu vực</th>
                  <th>Ngày đăng</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt="" className="admin-thumb" />
                      ) : (
                        <span className="admin-thumb admin-thumb-empty">—</span>
                      )}
                    </td>
                    <td data-label="Tiêu đề">
                      {p.title}
                      {p.featured && (
                        <span
                          style={{
                            marginLeft: 6,
                            fontSize: 11,
                            background: '#f5a524',
                            color: '#452c00',
                            padding: '1px 7px',
                            borderRadius: 999,
                            fontWeight: 700,
                          }}
                        >
                          Nổi bật
                        </span>
                      )}
                    </td>
                    <td data-label="Loại">
                      {PROPERTY_TYPE_LABEL[p.property_type]}
                      <br />
                      <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </td>
                    <td data-label="Giá">{displayPrice(p)}</td>
                    <td data-label="Khu vực">
                      {[p.district, p.province].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td data-label="Ngày đăng">{formatDate(p.created_at)}</td>
                    <td className="td-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditing(p)}>
                        Sửa
                      </button>{' '}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {!loading && tab === 'contacts' && (
        <div className="panel table-wrap">
          {contacts.length === 0 ? (
            <div className="empty" style={{ border: 'none' }}>
              Chưa có liên hệ nào.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>Điện thoại</th>
                  <th>Nội dung</th>
                  <th>Tin đăng</th>
                  <th>Ngày gửi</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className={c.is_read ? '' : 'row-unread'}>
                    <td data-label="Họ tên">
                      {!c.is_read && <span className="dot-unread" title="Chưa xem" />}
                      {c.name}
                    </td>
                    <td data-label="Điện thoại">
                      <a href={`tel:${c.phone.replace(/\s/g, '')}`} style={{ color: 'var(--primary)' }}>
                        {c.phone}
                      </a>
                    </td>
                    <td data-label="Nội dung" style={{ maxWidth: 280 }}>
                      {c.message || '—'}
                    </td>
                    <td data-label="Tin đăng">{c.property_id ? `#${c.property_id}` : '—'}</td>
                    <td data-label="Ngày gửi">{formatDate(c.created_at)}</td>
                    <td className="td-actions">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteContact(c)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
