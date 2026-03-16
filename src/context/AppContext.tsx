import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  currentUser,
  initialUnknowns,
  proposalSections as defaultProposalSections,
  bidLineItemTypes,
  productionTasks as defaultTasks,
  taskGroups as defaultTaskGroups,
  leadTemplates as defaultLeadTemplates,
  clientRateSheets as defaultRateSheets,
} from '../mockData';
import type {
  Unknown,
  ProposalSection,
  BidLineItemType,
  ProductionTask,
  TaskGroup,
  LeadTemplate,
  ClientRateSheet,
} from '../mockData';

// ── Interfaces ──────────────────────────────────────────────────────────────

interface LeadState {
  leadName: string;
  leadNumber: string;
  clientId: string;
  clientName: string;
  siteAddress: string;
  siteName: string;
  bidDue: string;
  walkthroughDate: string;
  estimatorId: string;
  workTypes: string[];
  confidence: 'Low' | 'Medium' | 'High';
  contractValue: string;
  occupancyType: string;
  hazmatNotes: string;
  templateId: string;
  jobWalkCaptured: boolean;
  reachOutLogged: boolean;
  pursuitDecisionRecorded: boolean;
  handoffBriefGenerated: boolean;
  discoveryPacketReady: boolean;
  lineItemsExtracted: boolean;
  unknowns: Unknown[];
  selectedLineItems: string[];
  proposalSections: ProposalSection[];
  markupMethod: 'total' | 'per_section' | 'per_line_item';
  proposalStatus: 'none' | 'draft' | 'sent' | 'signed' | 'awarded';
  quickQuoteTaskSelections: { taskId: string; qty: number; rate: number }[];
  reachOutNotes: string;
  pursuitDecision: 'pursue' | 'no_bid' | '';
  pursuitNotes: string;
  outcomeResult: 'won' | 'lost' | 'no_bid' | '';
  projectCreated: boolean;
  projectNumber: string;
}

interface AppState {
  currentUser: typeof currentUser;
  activeLead: LeadState | null;
  activeSection: string;
  activeSections: string[];
  modalOpen: string | null;
  adminBidTypes: BidLineItemType[];
  adminTasks: ProductionTask[];
  adminTaskGroups: TaskGroup[];
  adminLeadTemplates: LeadTemplate[];
  adminRateSheets: ClientRateSheet[];
}

// ── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_FIELD'; payload: { field: string; value: any } }
  | { type: 'SET_ACTIVE_SECTION'; payload: string }
  | { type: 'ADD_SECTION'; payload: string }
  | { type: 'SET_MODAL'; payload: string | null }
  | { type: 'CREATE_LEAD'; payload: Partial<LeadState> }
  | { type: 'SET_DISCOVERY_READY' }
  | { type: 'UPDATE_UNKNOWN'; payload: { id: string; status: string; resolution?: string } }
  | { type: 'SET_LINE_ITEMS_EXTRACTED' }
  | { type: 'SET_PROPOSAL_STATUS'; payload: string }
  | { type: 'SET_MARKUP_METHOD'; payload: string }
  | { type: 'SET_TEMPLATE'; payload: string }
  | { type: 'ADD_QUICK_QUOTE_TASK'; payload: { taskId: string; qty: number; rate: number } }
  | { type: 'REMOVE_QUICK_QUOTE_TASK'; payload: string }
  | { type: 'UPDATE_QUICK_QUOTE_TASK'; payload: { taskId: string; qty?: number; rate?: number } }
  | { type: 'UPDATE_ADMIN_BID_TYPE'; payload: BidLineItemType }
  | { type: 'UPDATE_ADMIN_TASK'; payload: ProductionTask }
  | { type: 'ADD_ADMIN_TASK_GROUP'; payload: TaskGroup }
  | { type: 'UPDATE_ADMIN_TEMPLATE'; payload: LeadTemplate }
  | { type: 'UPDATE_ADMIN_RATE_SHEET'; payload: ClientRateSheet };

// ── Default lead factory ────────────────────────────────────────────────────

function createDefaultLead(partial: Partial<LeadState>): LeadState {
  return {
    leadName: '',
    leadNumber: `LD-${Date.now().toString().slice(-6)}`,
    clientId: '',
    clientName: '',
    siteAddress: '',
    siteName: '',
    bidDue: '',
    walkthroughDate: '',
    estimatorId: currentUser.id,
    workTypes: [],
    confidence: 'Medium',
    contractValue: '',
    occupancyType: '',
    hazmatNotes: '',
    templateId: '',
    jobWalkCaptured: false,
    reachOutLogged: false,
    pursuitDecisionRecorded: false,
    handoffBriefGenerated: false,
    discoveryPacketReady: false,
    lineItemsExtracted: false,
    unknowns: [...initialUnknowns],
    selectedLineItems: [],
    proposalSections: defaultProposalSections.map((s) => ({ ...s })),
    markupMethod: 'total',
    proposalStatus: 'none',
    quickQuoteTaskSelections: [],
    reachOutNotes: '',
    pursuitDecision: '',
    pursuitNotes: '',
    outcomeResult: '',
    projectCreated: false,
    projectNumber: '',
    ...partial,
  };
}

// ── Initial state ───────────────────────────────────────────────────────────

const initialState: AppState = {
  currentUser,
  activeLead: null,
  activeSection: 'general-info',
  activeSections: ['general-info', 'discovery', 'files', 'proposals'],
  modalOpen: null,
  adminBidTypes: bidLineItemTypes,
  adminTasks: defaultTasks,
  adminTaskGroups: defaultTaskGroups,
  adminLeadTemplates: defaultLeadTemplates,
  adminRateSheets: defaultRateSheets,
};

// ── Reducer ─────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_FIELD': {
      if (!state.activeLead) return state;
      return {
        ...state,
        activeLead: {
          ...state.activeLead,
          [action.payload.field]: action.payload.value,
        },
      };
    }

    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };

    case 'ADD_SECTION':
      if (state.activeSections.includes(action.payload)) return state;
      return {
        ...state,
        activeSections: [...state.activeSections, action.payload],
      };

    case 'SET_MODAL':
      return { ...state, modalOpen: action.payload };

    case 'CREATE_LEAD':
      return {
        ...state,
        activeLead: createDefaultLead(action.payload),
        activeSection: 'general-info',
      };

    case 'SET_DISCOVERY_READY': {
      if (!state.activeLead) return state;
      return {
        ...state,
        activeLead: { ...state.activeLead, discoveryPacketReady: true },
      };
    }

    case 'UPDATE_UNKNOWN': {
      if (!state.activeLead) return state;
      return {
        ...state,
        activeLead: {
          ...state.activeLead,
          unknowns: state.activeLead.unknowns.map((u) =>
            u.id === action.payload.id
              ? { ...u, status: action.payload.status as Unknown['status'], resolution: action.payload.resolution ?? u.resolution }
              : u
          ),
        },
      };
    }

    case 'SET_LINE_ITEMS_EXTRACTED': {
      if (!state.activeLead) return state;
      return {
        ...state,
        activeLead: { ...state.activeLead, lineItemsExtracted: true },
      };
    }

    case 'SET_PROPOSAL_STATUS': {
      if (!state.activeLead) return state;
      return {
        ...state,
        activeLead: {
          ...state.activeLead,
          proposalStatus: action.payload as LeadState['proposalStatus'],
        },
      };
    }

    case 'SET_MARKUP_METHOD': {
      if (!state.activeLead) return state;
      return {
        ...state,
        activeLead: {
          ...state.activeLead,
          markupMethod: action.payload as LeadState['markupMethod'],
        },
      };
    }

    case 'SET_TEMPLATE': {
      if (!state.activeLead) return state;
      return {
        ...state,
        activeLead: { ...state.activeLead, templateId: action.payload },
      };
    }

    case 'ADD_QUICK_QUOTE_TASK': {
      if (!state.activeLead) return state;
      return {
        ...state,
        activeLead: {
          ...state.activeLead,
          quickQuoteTaskSelections: [
            ...state.activeLead.quickQuoteTaskSelections,
            action.payload,
          ],
        },
      };
    }

    case 'REMOVE_QUICK_QUOTE_TASK': {
      if (!state.activeLead) return state;
      return {
        ...state,
        activeLead: {
          ...state.activeLead,
          quickQuoteTaskSelections:
            state.activeLead.quickQuoteTaskSelections.filter(
              (t) => t.taskId !== action.payload
            ),
        },
      };
    }

    case 'UPDATE_QUICK_QUOTE_TASK': {
      if (!state.activeLead) return state;
      return {
        ...state,
        activeLead: {
          ...state.activeLead,
          quickQuoteTaskSelections:
            state.activeLead.quickQuoteTaskSelections.map((t) =>
              t.taskId === action.payload.taskId
                ? {
                    ...t,
                    ...(action.payload.qty !== undefined && { qty: action.payload.qty }),
                    ...(action.payload.rate !== undefined && { rate: action.payload.rate }),
                  }
                : t
            ),
        },
      };
    }

    case 'UPDATE_ADMIN_BID_TYPE':
      return {
        ...state,
        adminBidTypes: state.adminBidTypes.map((bt) =>
          bt.id === action.payload.id ? action.payload : bt
        ),
      };

    case 'UPDATE_ADMIN_TASK':
      return {
        ...state,
        adminTasks: state.adminTasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'ADD_ADMIN_TASK_GROUP':
      return {
        ...state,
        adminTaskGroups: [...state.adminTaskGroups, action.payload],
      };

    case 'UPDATE_ADMIN_TEMPLATE':
      return {
        ...state,
        adminLeadTemplates: state.adminLeadTemplates.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'UPDATE_ADMIN_RATE_SHEET':
      return {
        ...state,
        adminRateSheets: state.adminRateSheets.map((rs) =>
          rs.id === action.payload.id ? action.payload : rs
        ),
      };

    default:
      return state;
  }
}

// ── Context ─────────────────────────────────────────────────────────────────

const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppContext(): AppState {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export function useAppDispatch(): React.Dispatch<Action> {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
}

export type { LeadState, AppState, Action };
