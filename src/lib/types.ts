export type PropertyType = 'nha' | 'dat' | 'can-ho' | 'biet-thu' | 'kho-xuong';
export type PropertyStatus = 'ban' | 'thue' | 'da-ban';

export interface Property {
  id: number;
  title: string;
  description: string | null;
  price: number;
  /** Giá dạng chữ ("8xx triệu"); rỗng thì format từ price */
  price_text: string | null;
  area: number;
  bedrooms: number;
  bathrooms: number;
  property_type: PropertyType;
  status: PropertyStatus;
  address: string | null;
  district: string | null;
  province: string | null;
  images: string[];
  featured: boolean;
  contact_name: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
}

export const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  nha: 'Nhà phố',
  dat: 'Đất nền',
  'can-ho': 'Căn hộ',
  'biet-thu': 'Biệt thự',
  'kho-xuong': 'Kho xưởng',
};

export const STATUS_LABEL: Record<PropertyStatus, string> = {
  ban: 'Bán',
  thue: 'Cho thuê',
  'da-ban': 'Đã bán',
};
