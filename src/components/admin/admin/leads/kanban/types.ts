export type LeadStage =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "negotiation"
  | "won"
  | "lost"
  | "stale";

export interface KanbanLead {
  _id: string;
  stage: LeadStage;
  tripType: string;
  destination: string;
  guests: number;
  budget: number;
  travelDate: string;
  travelers: {
    name: string;
    phone: string;
  }[];
  agentId?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const LEAD_STAGES: LeadStage[] = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "negotiation",
  "won",
  "lost",
  "stale",
];
