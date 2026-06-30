export type Role = "ADMIN" | "USER";

export type DebtStatus =
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "REJECTED"
  | "PENDING_PAYMENT_APPROVAL"
  | "SETTLED";

export interface PublicUser {
  id: string;
  username: string;
  name: string;
  role: Role;
  mustChangePassword: boolean;
}

export interface SimpleUser {
  id: string;
  name: string;
  username: string;
}

export interface DebtRecord {
  id: string;
  creditorId: string;
  debtorId: string;
  amount: number;
  title: string;
  date: string;
  status: DebtStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CounterpartyNet {
  counterpartyId: string;
  counterpartyName: string;
  counterpartyUsername: string;
  net: number;
}

export interface InboxItem extends DebtRecord {
  creditor?: SimpleUser;
  debtor?: SimpleUser;
}

export interface DebtSummaryResponse {
  summary: CounterpartyNet[];
  inbox: {
    pendingApprovals: InboxItem[];
    pendingPaymentApprovals: InboxItem[];
  };
}

export interface AdminUser extends PublicUser {
  createdAt: string;
}
