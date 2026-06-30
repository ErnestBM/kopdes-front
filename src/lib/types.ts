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
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
}

export interface SimpleUser {
  id: string;
  name: string;
  username: string;
}

export interface CounterpartyProfile extends SimpleUser {
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
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

export interface PendingPaymentApproval {
  counterparty: SimpleUser;
  amount: number;
}

export interface DebtSummaryResponse {
  summary: CounterpartyNet[];
  inbox: {
    pendingApprovals: InboxItem[];
    pendingPaymentApprovals: PendingPaymentApproval[];
  };
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: Role;
  mustChangePassword: boolean;
  createdAt: string;
}
