// src/mockData.ts
// Single source of truth for all prototype data.
// All AI simulation outputs come from this file.

export interface User {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export interface Contact {
  name: string;
  title: string;
  email: string;
  phone: string;
  primary: boolean;
}

export interface Client {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  contacts: Contact[];
  address: string;
  priorJobs: number;
  paymentHistory: string;
  hasRateSheet: boolean;
}

export interface WorkType {
  id: string;
  label: string;
  description: string;
}

export interface SectionConfig {
  id: string;
  name: string;
  visible: boolean;
  fields: FieldConfig[];
}

export interface FieldConfig {
  name: string;
  required: boolean;
}

export interface LeadTemplate {
  id: string;
  name: string;
  description: string;
  workTypes: string[];
  sections: SectionConfig[];
  source: 'Seeded' | 'User Created' | 'System Default';
}

export interface ProductionTask {
  id: string;
  name: string;
  code: string;
  uom: string;
  uomName: string;
  prodRatePerHour: number | null;
  billingRate: number;
  positionCode: string;
  positionBurdenRate: number;
  description: string;
  groups: string[];
  source: 'Seeded' | 'User Created';
}

export interface TaskGroup {
  id: string;
  name: string;
  description: string;
  taskCount: number;
  source: 'Seeded' | 'User Created';
}

export interface BidLineItemType {
  id: string;
  name: string;
  code: string;
  fields: string[];
  connectsTo: 'inventory' | 'tasks' | null;
  source: 'System Default' | 'Seeded' | 'User Created';
  isNew: boolean;
  status: 'active' | 'inactive';
}

export interface ClientRateSheet {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  effectiveDate: string;
  expirationDate: string;
  status: 'Active' | 'Expired';
  items: ClientRateSheetItem[];
}

export interface ClientRateSheetItem {
  itemType: 'task' | 'inventory' | 'position';
  itemId: string;
  itemName: string;
  baseRate: number;
  clientRate: number;
  modifierPercent: number;
  unit: string;
  notes: string;
}

export interface Lead {
  id: string;
  leadNumber: string;
  name: string;
  clientId: string;
  clientName: string;
  workTypes: string[];
  salesperson: string;
  estimator: string;
  bidDue: string;
  walkthrough?: string;
  status: 'Draft' | 'In Progress' | 'Proposal Sent' | 'Won' | 'Lost';
  confidence: 'Low' | 'Medium' | 'High';
  contractValue: number | null;
  lastActivity: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  pages: number;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  processedByAI: boolean;
  confidence: 'high' | 'medium' | 'low';
  isNew?: boolean;
}

export interface RiskSignal {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  sources: string[];
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface Unknown {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  owner: string;
  ownerName: string;
  deadline: string;
  status: 'open' | 'pending_confirmation' | 'pending_response' | 'resolved';
  source: string;
  resolution?: string;
}

export interface EvidenceItem {
  id: string;
  type: 'photo' | 'voice_note' | 'text_note';
  tag: string;
  note?: string;
  transcript?: string;
  extractedItems?: string[];
  timestamp: string;
}

export interface LineItem {
  id: string;
  type: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
  confidence: 'high' | 'medium' | 'low';
  source: string;
  section: 'abatement' | 'demo' | 'icra';
  taskId?: string;
}

export interface ProposalSection {
  id: string;
  name: string;
  lineItemIds: string[];
  subtotal: number;
  markup: number;
  markedUpTotal: number;
}

export interface RateSheetItem {
  item: string;
  type: string;
  baseRate: number;
  clientRate: number | null;
  unit: string;
  appliedAs: string;
  inventoryMatch: 'high' | 'medium' | 'none';
}

// ── CURRENT USER ──────────────────────────────────────────────────────────────
export const currentUser: User = {
  id: 'u-001',
  name: 'Marcus Chen',
  role: 'Business Development Manager',
  initials: 'MC',
};

// ── ALL USERS ─────────────────────────────────────────────────────────────────
export const users: User[] = [
  { id: 'u-001', name: 'Marcus Chen', role: 'BDM', initials: 'MC' },
  { id: 'u-002', name: 'Laura Reyes', role: 'Estimator', initials: 'LR' },
  { id: 'u-003', name: 'Diana Torres', role: 'VP Operations', initials: 'DT' },
  { id: 'u-004', name: 'James Okafor', role: 'Estimator', initials: 'JO' },
  { id: 'u-005', name: 'Sofia Mendez', role: 'BDM', initials: 'SM' },
];

// ── CLIENTS ───────────────────────────────────────────────────────────────────
export const clients: Client[] = [
  {
    id: 'c-001',
    name: 'Westfield Construction',
    status: 'Active',
    contacts: [
      { name: 'Jen Martinez', title: 'Project Coordinator', email: 'jen.martinez@westfieldconstruction.com', phone: '480-555-0142', primary: true },
      { name: 'Rob Haller', title: 'VP Construction', email: 'r.haller@westfieldconstruction.com', phone: '480-555-0198', primary: false },
    ],
    address: '1200 N. Scottsdale Rd, Scottsdale, AZ 85251',
    priorJobs: 2,
    paymentHistory: 'On time',
    hasRateSheet: false,
  },
  {
    id: 'c-002',
    name: 'HomeShield Insurance',
    status: 'Active',
    contacts: [
      { name: 'Kevin Harmon', title: 'Claims Adjuster', email: 'kevin.harmon@homeshield.com', phone: '602-555-0371', primary: true },
    ],
    address: '2400 E. Camelback Rd, Phoenix, AZ 85016',
    priorJobs: 14,
    paymentHistory: 'On time',
    hasRateSheet: true,
  },
  {
    id: 'c-003',
    name: 'Greystone Development',
    status: 'Active',
    contacts: [
      { name: 'Patricia Walsh', title: 'Project Manager', email: 'p.walsh@greystonedv.com', phone: '602-555-0287', primary: true },
    ],
    address: '3300 N. Central Ave, Phoenix, AZ 85012',
    priorJobs: 0,
    paymentHistory: 'Unknown',
    hasRateSheet: false,
  },
  {
    id: 'c-004',
    name: 'Banner Health Systems',
    status: 'Active',
    contacts: [
      { name: 'Darren Cole', title: 'Facilities Director', email: 'd.cole@bannerhealth.com', phone: '602-555-0519', primary: true },
    ],
    address: '1441 N. 12th St, Phoenix, AZ 85006',
    priorJobs: 5,
    paymentHistory: 'On time',
    hasRateSheet: false,
  },
  {
    id: 'c-005',
    name: 'State Farm Insurance',
    status: 'Active',
    contacts: [
      { name: 'Claims Adjuster', title: 'Adjuster', email: 'claims@statefarm.com', phone: '602-555-0400', primary: true },
    ],
    address: '3200 E. Camelback Rd, Phoenix, AZ 85018',
    priorJobs: 8,
    paymentHistory: 'On time',
    hasRateSheet: true,
  },
];

// ── WORK TYPES ────────────────────────────────────────────────────────────────
export const workTypes: WorkType[] = [
  { id: 'wt-01', label: 'Selective Interior Demolition', description: 'Gutting interiors, ceiling/floor removal, tenant improvements' },
  { id: 'wt-02', label: 'Abatement (ACM/Lead)', description: 'Removal of asbestos-containing materials, air monitoring, containment' },
  { id: 'wt-03', label: 'Structural Demolition', description: 'Bringing down buildings, concrete crushing, steel dismantling' },
  { id: 'wt-04', label: 'Environmental Remediation', description: 'Soil contamination, UST removal, mold, hazmat cleanup' },
  { id: 'wt-05', label: 'Multi-Site / Program Work', description: 'Retail rollouts, chain renovations at scale' },
  { id: 'wt-06', label: 'Healthcare Environments (ICRA)', description: 'Hospital renovations with infection control requirements' },
  { id: 'wt-07', label: 'Prevailing Wage', description: 'Government or public sector work with certified payroll' },
  { id: 'wt-08', label: 'Insurance / Homeowner Direct', description: 'Carrier-referred residential and commercial insurance work' },
];

// ── LEAD TEMPLATES ────────────────────────────────────────────────────────────
export const leadTemplates: LeadTemplate[] = [
  {
    id: 'lt-01', name: 'Commercial Abatement — Full Discovery', description: 'Multi-phase commercial job with hazmat, job walk, and regulatory review',
    workTypes: ['Abatement (ACM/Lead)', 'Selective Interior Demolition'],
    sections: [
      { id: 'sec-site', name: 'Site Address', visible: true, fields: [{ name: 'Address', required: true }, { name: 'City', required: true }, { name: 'State', required: true }, { name: 'ZIP', required: true }] },
      { id: 'sec-bldg', name: 'Building Info', visible: true, fields: [{ name: 'Type', required: true }, { name: 'Area (SF)', required: true }, { name: 'Floors', required: false }, { name: 'Occupied', required: true }] },
      { id: 'sec-perm', name: 'Permits', visible: true, fields: [{ name: 'NESHAP Notification', required: false }, { name: 'Building Permit', required: false }] },
      { id: 'sec-cert', name: 'Certificates', visible: true, fields: [{ name: 'Asbestos License', required: true }, { name: 'OSHA 30', required: false }] },
      { id: 'sec-ins', name: 'Insurance', visible: true, fields: [{ name: 'Carrier', required: false }] },
      { id: 'sec-emrg', name: 'Emergency Contacts', visible: true, fields: [{ name: 'Fire Dept', required: true }, { name: 'Hospital', required: true }] },
      { id: 'sec-comp', name: 'Compliance', visible: true, fields: [{ name: 'Certified Payroll', required: false }, { name: 'Prevailing Wage', required: false }] },
      { id: 'sec-bill', name: 'Billing / GC', visible: true, fields: [{ name: 'GC Contact', required: true }] },
      { id: 'sec-cons', name: 'Consultant', visible: true, fields: [{ name: 'Name', required: false }] },
      { id: 'sec-airm', name: 'Air Monitoring', visible: true, fields: [{ name: 'Required', required: false }] },
      { id: 'sec-lien', name: 'Lien Info', visible: false, fields: [] },
      { id: 'sec-desg', name: 'Designer', visible: false, fields: [] },
      { id: 'sec-ownr', name: 'Owner Info', visible: false, fields: [] },
    ], source: 'Seeded',
  },
  {
    id: 'lt-02', name: 'Insurance Residential — Quick Quote', description: 'Single-trade residential insurance job, minimal fields',
    workTypes: ['Abatement (ACM/Lead)', 'Insurance / Homeowner Direct'],
    sections: [
      { id: 'sec-site', name: 'Site Address', visible: true, fields: [{ name: 'Address', required: true }, { name: 'City', required: true }, { name: 'State', required: true }, { name: 'ZIP', required: true }] },
      { id: 'sec-bldg', name: 'Building Info', visible: true, fields: [{ name: 'Type', required: true }, { name: 'Area (SF)', required: false }, { name: 'Occupied', required: false }] },
      { id: 'sec-ins', name: 'Insurance', visible: true, fields: [{ name: 'Carrier', required: true }, { name: 'Claim #', required: false }, { name: 'Adjuster', required: false }] },
      { id: 'sec-emrg', name: 'Emergency Contacts', visible: true, fields: [{ name: 'Fire Dept', required: false }, { name: 'Hospital', required: false }] },
      { id: 'sec-comp', name: 'Compliance', visible: true, fields: [{ name: 'Certified Payroll', required: false }] },
      { id: 'sec-perm', name: 'Permits', visible: false, fields: [] },
      { id: 'sec-cert', name: 'Certificates', visible: false, fields: [] },
      { id: 'sec-lien', name: 'Lien Info', visible: false, fields: [] },
      { id: 'sec-desg', name: 'Designer', visible: false, fields: [] },
      { id: 'sec-cons', name: 'Consultant', visible: false, fields: [] },
      { id: 'sec-airm', name: 'Air Monitoring', visible: false, fields: [] },
      { id: 'sec-bill', name: 'Billing / GC', visible: false, fields: [] },
      { id: 'sec-ownr', name: 'Owner Info', visible: false, fields: [] },
    ], source: 'Seeded',
  },
  {
    id: 'lt-03', name: 'Repeat GC Client', description: 'Established GC relationship, reduced discovery requirements',
    workTypes: ['all'], sections: [], source: 'User Created',
  },
  {
    id: 'lt-04', name: 'Full Discovery', description: 'All sections visible — maximum detail',
    workTypes: ['all'], sections: [], source: 'System Default',
  },
];

// ── EXISTING LEADS ────────────────────────────────────────────────────────────
export const existingLeads: Lead[] = [
  {
    id: 'l-001',
    leadNumber: '2024-0347',
    name: 'Chandler Medical Plaza — Demo + Abatement',
    clientId: 'c-001',
    clientName: 'Westfield Construction',
    workTypes: ['Abatement (ACM/Lead)', 'Selective Interior Demo'],
    salesperson: 'Marcus Chen',
    estimator: 'Laura Reyes',
    bidDue: '2026-03-17',
    walkthrough: '2026-03-13T10:00:00',
    status: 'In Progress',
    confidence: 'Medium',
    contractValue: null,
    lastActivity: 'Today 8:16 AM',
  },
  {
    id: 'l-002',
    leadNumber: '2024-0341',
    name: 'Mesa Gateway Office Park Demo',
    clientId: 'c-003',
    clientName: 'Greystone Development',
    workTypes: ['Selective Interior Demo'],
    salesperson: 'Sofia Mendez',
    estimator: 'James Okafor',
    bidDue: '2026-03-10',
    status: 'Proposal Sent',
    confidence: 'High',
    contractValue: 124000,
    lastActivity: 'Yesterday',
  },
  {
    id: 'l-003',
    leadNumber: '2024-0338',
    name: 'Banner Health ICRA Renovation',
    clientId: 'c-004',
    clientName: 'Banner Health Systems',
    workTypes: ['Abatement (ACM/Lead)', 'Healthcare Environments (ICRA)'],
    salesperson: 'Marcus Chen',
    estimator: 'Laura Reyes',
    bidDue: '2026-03-05',
    status: 'Won',
    confidence: 'High',
    contractValue: 312000,
    lastActivity: 'Mar 8',
  },
  {
    id: 'l-004',
    leadNumber: '2024-0329',
    name: 'Camelback Tower Interior Demo',
    clientId: 'c-003',
    clientName: 'Greystone Development',
    workTypes: ['Selective Interior Demo'],
    salesperson: 'Marcus Chen',
    estimator: 'James Okafor',
    bidDue: '2026-02-28',
    status: 'Lost',
    confidence: 'Low',
    contractValue: null,
    lastActivity: 'Feb 25',
  },
];

// ── DOCUMENTS ───────────────────────────────────────────────────────────────
export const leadDocuments: Document[] = [
  { id: 'doc-01', name: 'demo-plan-chandler-c.pdf', type: 'Demolition Plan', pages: 12, size: '4.2 MB', uploadedBy: 'Marcus Chen', uploadedAt: '2026-03-10T08:18:00', processedByAI: true, confidence: 'high' },
  { id: 'doc-02', name: 'hazmat-survey-chandler.pdf', type: 'Hazmat Survey', pages: 8, size: '2.8 MB', uploadedBy: 'Marcus Chen', uploadedAt: '2026-03-10T08:18:00', processedByAI: true, confidence: 'high' },
  { id: 'doc-03', name: 'scope-narrative.docx', type: 'Scope Narrative', pages: 2, size: '0.4 MB', uploadedBy: 'Marcus Chen', uploadedAt: '2026-03-10T08:18:00', processedByAI: true, confidence: 'medium' },
  { id: 'doc-04', name: 'icra-protocol-chandler.pdf', type: 'ICRA Protocol', pages: 6, size: '1.1 MB', uploadedBy: 'Marcus Chen', uploadedAt: '2026-03-14T14:02:00', processedByAI: true, confidence: 'high', isNew: true },
  { id: 'doc-05', name: 'structural-drawings-c.pdf', type: 'Structural Drawings', pages: 22, size: '18.7 MB', uploadedBy: 'Marcus Chen', uploadedAt: '2026-03-14T14:02:00', processedByAI: true, confidence: 'high', isNew: true },
];

// ── DISCOVERY PACKET ─────────────────────────────────────────────────────────
export const discoveryPacketData = {
  siteClassification: {
    facilityType: 'Medical office building (occupied)',
    workTypesDetected: ['Selective Interior Demo', 'Abatement (ACM/Lead)'],
    confidence: 'High' as const,
  },
  scopeSummary: [
    { text: 'Selective demo of interior partitions, ceilings, and flooring across 4th floor, Building C', source: 'scope-narrative.docx p.1', confidence: 'high' as const },
    { text: 'Approx. 8,400 SF affected area', source: 'scope-narrative.docx p.1', confidence: 'high' as const },
    { text: 'Phased access — work in two phases to maintain tenant operations on 3rd floor', source: 'scope-narrative.docx p.2', confidence: 'medium' as const },
  ],
  hazardIndicators: [
    { type: 'confirmed', label: 'ACM — 9x9 floor tile with mastic (3% chrysotile)', area: '~2,400 SF in affected suites', source: 'hazmat-survey-chandler.pdf p.4' },
    { type: 'presumed', label: 'ACM — pipe insulation in mechanical room', area: 'Not measured — untested', source: 'hazmat-survey-chandler.pdf p.6' },
    { type: 'clear', label: 'Lead paint — negative on tested surfaces', area: 'Tested surfaces only', source: 'hazmat-survey-chandler.pdf p.5' },
  ],
  missingDocuments: [
    'Structural drawings — referenced in demo plan but not attached',
    'ICRA / infection control requirements — occupied medical facility, protocol not provided',
    'Utility shutoff documentation — required before demo can proceed',
  ],
};

// ── RISK SIGNALS ──────────────────────────────────────────────────────────────
export const riskSignals: RiskSignal[] = [
  {
    id: 'rs-01',
    title: 'Survey-scope gap — mechanical room',
    severity: 'high',
    description: 'Demo plan extends into mechanical room (Sheet D-3, Grid C4). Hazmat survey does not cover this area. Pipe insulation presumed positive but untested. Additional testing required before work can begin in this area.',
    sources: ['hazmat-survey-chandler.pdf p.6', 'demo-plan-chandler-c.pdf p.3'],
    status: 'active',
  },
  {
    id: 'rs-02',
    title: 'Occupied medical facility',
    severity: 'medium',
    description: 'Phased access constraints will affect production rates. Containment protocols may exceed standard abatement requirements given building occupancy and adjacent pediatric clinic on 3rd floor.',
    sources: ['scope-narrative.docx p.2'],
    status: 'active',
  },
  {
    id: 'rs-03',
    title: 'Tight bid timeline',
    severity: 'medium',
    description: '5 business days from walkthrough to bid submission — tight given confirmed ACM and phased access complexity.',
    sources: ['scope-narrative.docx p.1'],
    status: 'active',
  },
];

// ── UNKNOWNS REGISTER ─────────────────────────────────────────────────────────
export const initialUnknowns: Unknown[] = [
  {
    id: 'uk-01',
    title: 'ICRA requirements',
    description: 'Confirm whether pediatric clinic on 3rd floor triggers ICRA containment protocols for 4th floor demo and abatement work.',
    severity: 'high',
    owner: 'u-002',
    ownerName: 'Laura Reyes',
    deadline: 'Fri Mar 14',
    status: 'open',
    source: 'Job walk + Risk signal',
  },
  {
    id: 'uk-02',
    title: 'Mechanical room pipe insulation testing',
    description: 'Testing required before abatement can proceed in mechanical room. Pipe insulation presumed positive but untested.',
    severity: 'medium',
    owner: 'u-002',
    ownerName: 'Laura Reyes',
    deadline: 'Before bid submission',
    status: 'open',
    source: 'Discovery Packet — hazmat survey gap',
  },
  {
    id: 'uk-03',
    title: 'Freight elevator scheduling',
    description: 'GC stated verbally that Pinnacle will have priority access 6 AM to 2 PM. Written confirmation needed. Affects production rate assumptions.',
    severity: 'medium',
    owner: 'u-001',
    ownerName: 'Marcus Chen',
    deadline: 'Fri Mar 14',
    status: 'open',
    source: 'Job walk observation',
  },
];

// ── REACH-OUT SIGNAL EXTRACTION ───────────────────────────────────────────────
export const reachOutExtractedSignals = [
  { type: 'unknown_update', unknownId: 'uk-03', label: 'Unknown #3 updated', update: 'Elevator access 6 AM-2 PM confirmed verbally; written confirmation expected Friday', newStatus: 'pending_confirmation' as const },
  { type: 'unknown_update', unknownId: 'uk-01', label: 'Unknown #1 updated', update: 'GC checking with building management on ICRA requirement; response expected Friday', newStatus: 'pending_response' as const },
  { type: 'pipeline_signal', label: 'New pipeline signal', note: 'Potential Q2 opportunity — different Chandler medical campus. Flag for Diana Torres.' },
];

// ── JOB WALK EVIDENCE ─────────────────────────────────────────────────────────
export const jobWalkEvidence: EvidenceItem[] = [
  { id: 'ev-01', type: 'photo', tag: 'Ceiling condition', note: 'Drop ceiling, 2x4 tiles, original installation. Water staining near HVAC diffuser. Ductwork, cable trays, fire suppression visible through lifted tile.', timestamp: '2026-03-13T10:22:00' },
  { id: 'ev-02', type: 'photo', tag: 'Flooring / suspect ACM', note: '9x9 tile matches hazmat survey finding. Mastic visible at edges. Approximately 2,400 SF of this tile in the two affected suites.', timestamp: '2026-03-13T10:31:00' },
  { id: 'ev-03', type: 'photo', tag: 'Hazard / untested area', note: 'Pipe insulation visible on hot water and chilled water lines. Not covered by hazmat survey. GC confirmed this room is in scope. Testing required before abatement.', timestamp: '2026-03-13T10:48:00' },
  { id: 'ev-04', type: 'photo', tag: 'Access constraint', note: 'Single freight elevator, shared with building tenants. GC says priority access 6 AM to 2 PM only. Will limit debris removal rate significantly.', timestamp: '2026-03-13T11:03:00' },
  { id: 'ev-05', type: 'voice_note', tag: 'Phasing + stakeholder note', transcript: 'Talked to the GC coordinator about phasing. Phase 1 is the two tenant suites, Phase 2 is the corridor and common areas. They want Phase 1 done in 10 days — tight given abatement requirements. GC mentioned the 3rd floor tenant is a pediatric clinic. Will matter for containment. Should check if ICRA requirements apply.', extractedItems: ['uk-01', 'rs-02'], timestamp: '2026-03-13T11:15:00' },
];

// ── PROPOSAL LINE ITEMS ───────────────────────────────────────────────────────
export const extractedLineItems: LineItem[] = [
  { id: 'li-01', type: 'Labor / Task', description: 'ACM Floor Tile & Mastic Removal', quantity: 2400, unit: 'SF', rate: 3.85, total: 9240, confidence: 'high', source: 'hazmat-survey-chandler.pdf p.4', section: 'abatement' },
  { id: 'li-02', type: 'Labor / Task', description: 'ACM Pipe Insulation Removal — Mechanical Room', quantity: 1, unit: 'LS', rate: 4200, total: 4200, confidence: 'high', source: 'exactimate-export.pdf p.4', section: 'abatement' },
  { id: 'li-03', type: 'Equipment', description: 'Containment Barriers — ICRA Class III', quantity: 240, unit: 'LF', rate: 12.00, total: 2880, confidence: 'medium', source: 'exactimate-export.pdf p.5', section: 'icra' },
  { id: 'li-04', type: 'Equipment', description: 'HEPA Air Monitoring — Negative Air Machines', quantity: 10, unit: 'days', rate: 385, total: 3850, confidence: 'medium', source: 'exactimate-export.pdf p.6', section: 'icra' },
  { id: 'li-05', type: 'Waste / Haul', description: 'Regulated ACM Waste Disposal', quantity: 4, unit: 'ton', rate: 280, total: 1120, confidence: 'high', source: 'exactimate-export.pdf p.7', section: 'abatement' },
  { id: 'li-06', type: 'Labor / Task', description: 'Daily Monitoring — ICRA Protocol', quantity: 10, unit: 'days', rate: 285, total: 2850, confidence: 'high', source: 'icra-protocol-chandler.pdf p.3', section: 'icra' },
  { id: 'li-07', type: 'Labor / Task', description: 'Partition Demolition', quantity: 8400, unit: 'SF', rate: 1.20, total: 10080, confidence: 'medium', source: 'excel-template.xlsx col C', section: 'demo' },
  { id: 'li-08', type: 'Labor / Task', description: 'Ceiling Grid & Tile Removal', quantity: 8400, unit: 'SF', rate: 0.85, total: 7140, confidence: 'high', source: 'excel-template.xlsx col D', section: 'demo' },
  { id: 'li-09', type: 'Labor / Task', description: 'Flooring Removal & Substrate Prep', quantity: 8400, unit: 'SF', rate: 0.95, total: 7980, confidence: 'high', source: 'excel-template.xlsx col E', section: 'demo' },
  { id: 'li-10', type: 'Waste / Haul', description: 'C&D Debris Removal & Disposal', quantity: 18, unit: 'loads', rate: 425, total: 7650, confidence: 'medium', source: 'excel-template.xlsx col F', section: 'demo' },
  { id: 'li-11', type: 'Equipment', description: 'Dumpster — 30 Yard', quantity: 3, unit: 'each', rate: 650, total: 1950, confidence: 'high', source: 'excel-template.xlsx col G', section: 'demo' },
  { id: 'li-12', type: 'Labor / Task', description: 'Mobilization / Demobilization', quantity: 1, unit: 'LS', rate: 4500, total: 4500, confidence: 'high', source: 'excel-template.xlsx col A', section: 'demo' },
];

export const proposalSections: ProposalSection[] = [
  { id: 'sec-01', name: 'Abatement Scope', lineItemIds: ['li-01', 'li-02', 'li-05'], subtotal: 14560, markup: 22, markedUpTotal: 17763 },
  { id: 'sec-02', name: 'Selective Demolition Scope', lineItemIds: ['li-07', 'li-08', 'li-09', 'li-10', 'li-11', 'li-12'], subtotal: 39300, markup: 18, markedUpTotal: 46374 },
  { id: 'sec-03', name: 'ICRA Class III Containment', lineItemIds: ['li-03', 'li-04', 'li-06'], subtotal: 9580, markup: 15, markedUpTotal: 11017 },
];

export const proposalGrandTotal = 187500;

// ── RATE SHEET (HomeShield) ───────────────────────────────────────────────────
export const homeShieldRateSheet: RateSheetItem[] = [
  { item: 'ACM Floor Tile & Mastic Removal', type: 'Labor / Task', baseRate: 3.85, clientRate: 4.20, unit: 'SF', appliedAs: 'Per-unit premium — carrier schedule', inventoryMatch: 'high' },
  { item: 'Containment Setup — Single Room', type: 'Labor / Task', baseRate: 580, clientRate: 620, unit: 'LS', appliedAs: 'Lump sum premium', inventoryMatch: 'high' },
  { item: 'Regulated ACM Waste Disposal', type: 'Waste / Haul', baseRate: 280, clientRate: 290, unit: 'ton', appliedAs: 'Negotiated rate', inventoryMatch: 'high' },
  { item: 'Air Clearance Testing — Single Sample', type: 'Task', baseRate: 385, clientRate: null, unit: 'EA', appliedAs: 'Standard rate — not on carrier schedule', inventoryMatch: 'none' },
];

// ── DISCOVERY-TO-PROJECT TABS ─────────────────────────────────────────────────
export const discoveryToProjectTabs = [
  { tab: 'Project Details (Tab 2)', source: 'Discovery Packet', data: 'Selective interior demo + abatement, 4th floor, 8,400 SF, Phase 1: tenant suites, Phase 2: corridor', status: 'pending' as const },
  { tab: 'Permits / Notifications (Tab 5)', source: 'Risk Signals', data: 'ICRA Class III required. NESHAP notification may apply for ACM abatement.', status: 'pending' as const },
  { tab: 'Certificates / Licenses (Tab 7)', source: 'Work type profile', data: 'State asbestos abatement license (40-hr), OSHA 30, ICRA training, Respirator fit test', status: 'pending' as const },
  { tab: 'Building Information (Tab 10)', source: 'Discovery Packet', data: 'Medical office building, occupied, 4th floor, ~8,400 SF affected', status: 'pending' as const },
  { tab: 'Waste Management (Tab 12)', source: 'Hazmat survey extraction', data: 'ACM floor tile mastic (3% chrysotile), ACM pipe insulation, C&D debris', status: 'pending' as const },
  { tab: 'Billing / GC (Tab 14)', source: 'Lead record + reach-out', data: 'Westfield Construction, Jen Martinez, Project Coordinator', status: 'pending' as const },
  { tab: 'Consultant (Tab 16)', source: 'Reach-out notes', data: 'Environmental testing company — contact from mechanical room rush test', status: 'pending' as const },
];

// ── COMPLETENESS CHECKLIST STATES ─────────────────────────────────────────────
export const completenessStates = {
  afterDocUpload: { score: 62, items: [
    { item: 'Demolition plan', status: 'present' as const },
    { item: 'Hazmat survey', status: 'present' as const },
    { item: 'Scope narrative', status: 'present' as const },
    { item: 'Job walk', status: 'missing' as const },
    { item: 'Client contact', status: 'present' as const },
    { item: 'Structural drawings', status: 'missing' as const },
    { item: 'ICRA / infection control requirements', status: 'missing' as const },
    { item: 'Utility shutoff documentation', status: 'missing' as const },
    { item: 'Pursuit decision', status: 'missing' as const },
    { item: 'Open unknowns resolved', status: 'missing' as const },
  ]},
  afterNewDocs: { score: 78, items: [
    { item: 'Demolition plan', status: 'present' as const },
    { item: 'Hazmat survey', status: 'present' as const },
    { item: 'Scope narrative', status: 'present' as const },
    { item: 'Job walk', status: 'present' as const },
    { item: 'Client contact', status: 'present' as const },
    { item: 'Structural drawings', status: 'present' as const },
    { item: 'ICRA / infection control requirements', status: 'present' as const },
    { item: 'Utility shutoff documentation', status: 'missing' as const },
    { item: 'Pursuit decision', status: 'missing' as const },
    { item: 'Open unknowns resolved', status: 'missing' as const },
  ]},
  nearProposal: { score: 89, items: [
    { item: 'Demolition plan', status: 'present' as const },
    { item: 'Hazmat survey', status: 'present' as const },
    { item: 'Scope narrative', status: 'present' as const },
    { item: 'Job walk', status: 'present' as const },
    { item: 'Client contact', status: 'present' as const },
    { item: 'Structural drawings', status: 'present' as const },
    { item: 'ICRA / infection control requirements', status: 'present' as const },
    { item: 'Utility shutoff documentation', status: 'missing' as const },
    { item: 'Pursuit decision', status: 'present' as const },
    { item: 'Open unknowns resolved', status: 'missing' as const },
  ]},
};

// ── PRODUCTION TASKS ─────────────────────────────────────────────────────────
export const productionTasks: ProductionTask[] = [
  { id: 'pt-01', name: 'ACM Floor Tile Removal', code: 'ACMFT', uom: 'SF', uomName: 'Square Feet', prodRatePerHour: 20.0, billingRate: 5.00, positionCode: 'Abatement Worker', positionBurdenRate: 35.00, description: 'Removal and disposal of ACM-containing 9x9 floor tile and mastic per NESHAP regulations.', groups: ['Standard Abatement', 'Insurance Residential'], source: 'Seeded' },
  { id: 'pt-02', name: 'ACM Pipe Insulation Removal', code: 'ACMPI', uom: 'LF', uomName: 'Linear Feet', prodRatePerHour: 15.0, billingRate: 12.00, positionCode: 'Abatement Worker', positionBurdenRate: 35.00, description: 'Removal of ACM pipe insulation with full containment.', groups: ['Standard Abatement'], source: 'Seeded' },
  { id: 'pt-03', name: 'Containment Setup (ICRA III)', code: 'CONT', uom: 'Each', uomName: 'Each', prodRatePerHour: 0.5, billingRate: 2500.00, positionCode: 'Abatement Foreman', positionBurdenRate: 45.00, description: 'Full ICRA Class III containment barrier setup including negative air.', groups: ['Standard Abatement', 'ICRA Containment', 'Insurance Residential'], source: 'Seeded' },
  { id: 'pt-04', name: 'HEPA Air Monitoring', code: 'HEPA', uom: 'Day', uomName: 'Day', prodRatePerHour: 1.0, billingRate: 450.00, positionCode: 'Air Monitor Tech', positionBurdenRate: 40.00, description: 'Daily HEPA air monitoring and sampling during abatement operations.', groups: ['Standard Abatement', 'ICRA Containment', 'Insurance Residential'], source: 'Seeded' },
  { id: 'pt-05', name: 'Lead Paint Abatement', code: 'LEAD', uom: 'SF', uomName: 'Square Feet', prodRatePerHour: 12.0, billingRate: 8.00, positionCode: 'Abatement Worker', positionBurdenRate: 35.00, description: 'Lead paint removal by chemical or encapsulation method.', groups: ['Standard Abatement'], source: 'Seeded' },
  { id: 'pt-06', name: 'Mold Remediation', code: 'MOLD', uom: 'SF', uomName: 'Square Feet', prodRatePerHour: 10.0, billingRate: 6.50, positionCode: 'Abatement Worker', positionBurdenRate: 35.00, description: 'Mold remediation including containment, removal, and HEPA vacuuming.', groups: ['Standard Abatement'], source: 'Seeded' },
  { id: 'pt-07', name: 'Demo Cleanup / Final Wipe', code: 'CLEAN', uom: 'LS', uomName: 'Lump Sum', prodRatePerHour: null, billingRate: 500.00, positionCode: 'Demo Laborer', positionBurdenRate: 28.00, description: 'Final cleaning, HEPA vacuum, and wet wipe of work area.', groups: ['Demo Cleanup', 'Insurance Residential'], source: 'Seeded' },
  { id: 'pt-08', name: 'Partition Demo', code: 'PDEMO', uom: 'SF', uomName: 'Square Feet', prodRatePerHour: 50.0, billingRate: 1.20, positionCode: 'Demo Worker', positionBurdenRate: 30.00, description: 'Demolition of non-bearing partition walls including framing.', groups: ['Interior Demo'], source: 'Seeded' },
  { id: 'pt-09', name: 'Ceiling Removal', code: 'CEIL', uom: 'SF', uomName: 'Square Feet', prodRatePerHour: 40.0, billingRate: 0.85, positionCode: 'Demo Worker', positionBurdenRate: 30.00, description: 'Removal of suspended ceiling grid, tiles, and support wires.', groups: ['Interior Demo'], source: 'Seeded' },
  { id: 'pt-10', name: 'Debris Haul (Non-Friable)', code: 'HAUL', uom: 'Load', uomName: 'Load', prodRatePerHour: null, billingRate: 850.00, positionCode: 'Demo Laborer', positionBurdenRate: 28.00, description: 'Haul and disposal of non-friable construction debris.', groups: ['Demo Cleanup'], source: 'Seeded' },
];

// ── TASK GROUPS ───────────────────────────────────────────────────────────────
export const taskGroups: TaskGroup[] = [
  { id: 'tg-01', name: 'Standard Abatement', description: 'Core abatement tasks: tile, pipe, containment, monitoring, disposal, cleanup', taskCount: 8, source: 'Seeded' },
  { id: 'tg-02', name: 'Insurance Residential', description: 'Simplified residential set: tile, containment, monitoring, cleanup. For Quick Quote.', taskCount: 4, source: 'Seeded' },
  { id: 'tg-03', name: 'Interior Demo', description: 'Partition demo, ceiling removal, flooring, debris haul', taskCount: 6, source: 'Seeded' },
  { id: 'tg-04', name: 'Demo Cleanup', description: 'Final wipe, debris haul, dust suppression', taskCount: 3, source: 'Seeded' },
  { id: 'tg-05', name: 'ICRA Containment', description: 'Barriers, negative air, HEPA, daily monitoring — healthcare work', taskCount: 4, source: 'Seeded' },
];

// ── BID LINE ITEM TYPES ──────────────────────────────────────────────────────
export const bidLineItemTypes: BidLineItemType[] = [
  { id: 'blt-01', name: 'Labor', code: 'labor', fields: ['phase', 'position', 'laborType', 'qty', 'unitCost', 'markup'], connectsTo: null, source: 'System Default', isNew: false, status: 'active' },
  { id: 'blt-02', name: 'Per Diem', code: 'perdiem', fields: ['phase', 'position', 'qty', 'unitCost', 'markup'], connectsTo: null, source: 'System Default', isNew: false, status: 'active' },
  { id: 'blt-03', name: 'Inv-Materials', code: 'inv-mat', fields: ['itemSearch', 'unit', 'qty', 'unitCost', 'markup'], connectsTo: 'inventory', source: 'System Default', isNew: false, status: 'active' },
  { id: 'blt-04', name: 'Inv-Equipment', code: 'inv-eqp', fields: ['itemSearch', 'unit', 'qty', 'unitCost', 'markup'], connectsTo: 'inventory', source: 'System Default', isNew: false, status: 'active' },
  { id: 'blt-05', name: 'Waste/Scrap', code: 'waste', fields: ['phase', 'material', 'vehicleType', 'debitCredit', 'loads', 'qty', 'unitCost', 'markup'], connectsTo: null, source: 'System Default', isNew: false, status: 'active' },
  { id: 'blt-06', name: 'Haul', code: 'haul', fields: ['hauler', 'vehicleType', 'qty', 'unitCost', 'markup'], connectsTo: null, source: 'System Default', isNew: false, status: 'active' },
  { id: 'blt-07', name: 'Expenses', code: 'expense', fields: ['costType', 'qty', 'unitCost', 'markup'], connectsTo: null, source: 'System Default', isNew: false, status: 'active' },
  { id: 'blt-08', name: 'Contractor Estimates', code: 'contract', fields: ['subcontractor', 'qty', 'unitCost', 'markup'], connectsTo: null, source: 'System Default', isNew: false, status: 'active' },
  { id: 'blt-09', name: 'Alternate Price', code: 'alt', fields: ['altName', 'qty', 'unitCost', 'markup'], connectsTo: null, source: 'System Default', isNew: false, status: 'active' },
  { id: 'blt-10', name: 'Task', code: 'task', fields: ['taskSearch', 'qty', 'uom_readonly', 'billingRate_readonly', 'markup'], connectsTo: 'tasks', source: 'System Default', isNew: true, status: 'active' },
  { id: 'blt-11', name: 'Lump Sum', code: 'lumpsum', fields: ['description', 'amount'], connectsTo: null, source: 'System Default', isNew: true, status: 'active' },
  { id: 'blt-12', name: 'Containment', code: 'contain', fields: ['description', 'qty', 'uom', 'unitCost', 'markup'], connectsTo: null, source: 'Seeded', isNew: true, status: 'active' },
  { id: 'blt-13', name: 'Air Monitoring', code: 'airmon', fields: ['description', 'days', 'dailyRate', 'markup'], connectsTo: null, source: 'Seeded', isNew: true, status: 'active' },
];

// ── CLIENT RATE SHEETS ────────────────────────────────────────────────────────
export const clientRateSheets: ClientRateSheet[] = [
  {
    id: 'crs-01', clientId: 'c-005', clientName: 'State Farm Insurance',
    name: 'State Farm — Standard Abatement Rates', effectiveDate: '2026-01-01', expirationDate: '2026-12-31', status: 'Active',
    items: [
      { itemType: 'task', itemId: 'pt-01', itemName: 'ACM Floor Tile Removal', baseRate: 5.00, clientRate: 4.25, modifierPercent: -15, unit: 'SF', notes: 'MSA rate' },
      { itemType: 'task', itemId: 'pt-03', itemName: 'Containment Setup', baseRate: 2500, clientRate: 1800, modifierPercent: -28, unit: 'Each', notes: 'Volume discount' },
      { itemType: 'task', itemId: 'pt-04', itemName: 'HEPA Air Monitoring', baseRate: 450, clientRate: 450, modifierPercent: 0, unit: 'Day', notes: 'No override' },
      { itemType: 'inventory', itemId: 'inv-exc', itemName: 'Excavator (daily)', baseRate: 800, clientRate: 720, modifierPercent: -10, unit: 'Day', notes: 'Fleet rate' },
      { itemType: 'position', itemId: 'pos-dlab', itemName: 'Demo Laborer (hourly)', baseRate: 65, clientRate: 58.50, modifierPercent: -10, unit: 'Hr', notes: 'MSA rate' },
    ],
  },
  {
    id: 'crs-02', clientId: 'c-002', clientName: 'HomeShield Insurance',
    name: 'HomeShield — Carrier Rate Schedule', effectiveDate: '2026-01-01', expirationDate: '2026-12-31', status: 'Active',
    items: [
      { itemType: 'task', itemId: 'pt-01', itemName: 'ACM Floor Tile Removal', baseRate: 5.00, clientRate: 4.20, modifierPercent: -16, unit: 'SF', notes: 'Carrier schedule' },
      { itemType: 'task', itemId: 'pt-03', itemName: 'Containment Setup — Single Room', baseRate: 2500, clientRate: 620, modifierPercent: -75, unit: 'LS', notes: 'Lump sum carrier rate' },
      { itemType: 'task', itemId: 'pt-10', itemName: 'Regulated ACM Waste Disposal', baseRate: 850, clientRate: 290, modifierPercent: -66, unit: 'ton', notes: 'Negotiated rate' },
    ],
  },
];
