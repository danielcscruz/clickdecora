export interface Plan {
  id: number;
  name: string;
  slug: string;
  price_brl: number;
  description: string;
  features_json: string[];
}

export interface Purchase {
  id: number;
  protocol: string;
  status: "pending" | "paid" | "in_progress" | "delivered" | "cancelled";
  plan_id: number;
  created_at: string;
}

export interface Message {
  id: number;
  purchase_id: number;
  sender_id: number;
  sender_name: string;
  content: string;
  file_url: string | null;
  created_at: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: "client" | "admin";
  created_at: string;
}

export const STATUS_LABELS: Record<Purchase["status"], string> = {
  pending: "Aguardando pagamento",
  paid: "Pago — em análise",
  in_progress: "Em andamento",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const STATUS_COLORS: Record<Purchase["status"], string> = {
  pending: "text-amber-600 bg-amber-50",
  paid: "text-blue-600 bg-blue-50",
  in_progress: "text-primary bg-primary/5",
  delivered: "text-emerald-600 bg-emerald-50",
  cancelled: "text-red-600 bg-red-50",
};
