
export enum CapsuleState {
  ACTIVE = 'ACTIVE',
  PENDING_UNLOCK = 'PENDING_UNLOCK',
  UNLOCKED = 'UNLOCKED',
  EXPIRED = 'EXPIRED'
}

export enum UnlockRuleType {
  TIME_LOCK = 'TIME_LOCK',
  DEAD_MAN_SWITCH = 'DEAD_MAN_SWITCH',
  THRESHOLD = 'THRESHOLD',
  STAGED_RELEASE = 'STAGED_RELEASE',
  MULTI_CONDITION = 'MULTI_CONDITION'
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  actor: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface Beneficiary {
  id?: string;
  name: string;
  email: string;
  role?: 'HEIR' | 'EXECUTOR' | 'PROXY_GUARDIAN';
  share?: number;
}

export interface UnlockRule {
  type: UnlockRuleType;
  params: any; 
  description: string;
}

export interface Capsule {
  id: string;
  title: string;
  description: string;
  category: 'PERSONAL' | 'CRYPTO' | 'LEGAL' | 'BUSINESS';
  blobId: string; 
  sealProof: string; 
  owner: string;
  beneficiaries: Beneficiary[];
  unlockRules: UnlockRule[];
  state: CapsuleState;
  createdAt: number;
  lastPing: number;
  pingFrequencyDays: number;
  unlockTime?: number;
  healthScore: number;
  approvalsReceived?: number;
  totalApprovalsNeeded?: number;
  isActivated: boolean; // False = Editable Draft, True = Immutable Protocol
  auditLog: AuditLogEntry[];
}

export interface UserProfile {
  address: string;
  name: string;
  email: string;
  avatar: string;
  trustScore: number;
  capsulesCreated: number;
  badge?: {
    id: string;
    name: string;
    tier: string;
    icon: string;
    score: number;
  };
}
