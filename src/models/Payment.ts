export interface Payment {
  id: string;
  transaction: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  productName: string;
  amount: number;
  method: string;
  status: string;
  orderDate: string;
  createdAt?: string;
}

export function formatPhone(phone: string): string {

  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}
