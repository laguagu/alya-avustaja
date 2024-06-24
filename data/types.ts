export type Location = {
  id: number;
  name: string;
  street: string | null;
  zip: string | null;
  city: string | null;
  region: string | null;
  country: string;
  invoice_address: string | null;
  invoice_routercode: string | null;
  description: string;
  created_by_employee: number | null;
  name_extension: string;
  number: string;
  qr_code: string | null;
  reviewpattern_id: number | null;
  condition_mapping_template: number | null;
  previous_review_id: number | null;
  previous_review_time: string | null;
  account_id: number;
  parent_id: number | null;
  contract_id: number | null;
  previous_maintenance: string | null;
  next_maintenance: string | null;
  billing_account_id: number | null;
  www: string | null;
  image: string | null;
  address_id: number | null;
  coordinates: string | null;
  type: string | null;
  service_contact_id: number | null;
  service_account_id: number | null;
  user_id: number | null;
  serviceprogram_id: number | null;
  stage: string | null;
  device_amount: number | null;
  device_amount_default: number;
  potential: string | null;
  is_active: number;
  recordtype_id: number | null;
  created_by: number;
  updated_by: number;
  created: string;
  updated: string;
  latitude: number | null;
  longitude: number | null;
  in_recyclebin: number | null;
};

export type DataDevice = {
  custom_testi: string | null;
  id: number;
  name: string;
  description: string;
  functionallocation_id: number | null;
  amount: number | null;
  status: string;
  serial: string;
  identifier: string | null;
  batch: string | null;
  location: string | null;
  location_extension: string;
  location_latitude: number | null;
  location_longitude: number | null;
  address_id: number | null;
  warehouse_id: number | null;
  controlroom_id: number | null;
  container_id: number | null;
  spreadsheettemplate_id: number | null;
  assembly_id: number | null;
  classification: string | null;
  ip: number | null;
  ip2: number | null;
  ip3: number | null;
  has_warehouse_service_program: number;
  location_in_warehouse: string | null;
  location_in_warehouse_extension: string | null;
  previous_maintenance: string | null;
  next_maintenance: string | null;
  previous_inspection: number | null;
  previous_inspection_time: string | null;
  hours: number | null;
  total_hours: number | null;
  weekly_hours_avg: number | null;
  has_hours: number;
  account_id: number;
  contact_id: number | null;
  is_sold: number;
  owner_account_id: number;
  location_id: number | null;
  default_location_id: number;
  opportunity_id: number | null;
  comissioning: string | null;
  manufacturing_year: number | null;
  devicecategory_id: number;
  person_id: number;
  image: number;
  next_inspection: string | null;
  reviewpattern_id: number;
  condition_mapping_template: number | null;
  previous_review_id: number | null;
  previous_review_time: string | null;
  waiting_for_pickup: number;
  service_company: number | null;
  service_company_phone: string | null;
  service_company_email: string | null;
  weight: number | null;
  measurements: string | null;
  seller_id: number | null;
  manufacturer_id: number | null;
  brand: string;
  model: string;
  type: string | null;
  warranty_period: string | null;
  warranty_ends: string | null;
  warranty_terms: string | null;
  account_service_responsibility: number;
  qr_code: string;
  product_id: number;
  employee_id: number | null;
  serviceprogram_id: number | null;
  device_id: number | null;
  service_catalogitem_id: number | null;
  created_by_employee: number | null;
  usage_prohibited: number;
  reason_for_probited_usage: string | null;
  prohibited_usage_classification: string | null;
  disposal_recommendation: number;
  reason_for_disposal_recommendation: string;
  disposal_recommendation_classification: string | null;
  disposed: number;
  missing: number;
  allow_lease: number;
  usage_prohibitation_ends: string | null;
  is_active: number;
  recordtype_id: number | null;
  created_by: number;
  updated_by: number;
  created: string;
  updated: string;
  latitude: number | null;
  longitude: number | null;
  in_recyclebin: number | null;
  image_url?: string | undefined;
};

export type DeviceItemCard = {
  id: string;
  name: string;
  model: string; // Malli tai muu nimeäminen
  brand: string | null; // merkki
  devicecategory_id: number | null;
  image?: string;
  location: string | null;
  default_location_id: number | null; // Oletussijainti
  serial: string; // Sarjanumero
  image_url?: string;
};

export type DeviceItemExample = {
  id: string;
  name: string;
  devicecategory_id: number;
  status: string;
  owner: string;
  location: string;
  serialNumber: string;
  image?: string;
  issue: boolean;
  updateTime: Date;
  parts: Array<string>;
};

// Huom tarvitaan vielä image
export type ServiceTask = {
  id: number;
  name: string;
  approved_by_contact: string | null;
  approved: string | null;
  customer_responsibility: string | null;
  description: string | null;
  instruction: string | null;
  summary: string | null;
  identifier: string | null;
  device_id: number;
  device_serial: string;
  device_brand: string;
  device_model: string;
  account_id: number;
  location_id: number | null;
  approved_by_client: string | null;
  serviceprogram_id: number | null;
  serviceschedule_id: number | null;
  serviceschedule_target_date: string | null;
  opportunity_id: number | null;
  lineitem_id: number | null;
  type: string | null;
  begins: string | null;
  ends: string | null;
  begins_time: string | null;
  ends_time: string | null;
  completed: string | null;
  is_completed: number;
  hours: number | null;
  workload: number | null;
  is_statutory: number;
  maintenance_interval_logged: string | null;
  device_hours_logged: string | null;
  result: string;
  hourcomposition_id: number | null;
  review_source: string | null;
  review_followup: string | null;
  person_id: string | null;
  employee_id: number | null;
  next_service_id: number | null;
  next_service_description: string | null;
  missing_equipments: string | null;
  used_equipments: string | null;
  purchase_suggestion: string | null;
  repair_deficit: string | null;
  group_id: number | null;
  payer_id: number | null;
  instruction_file_id: number | null;
  problem_description: string | null;
  task_id: number | null;
  reviewpattern_id: number | null;
  workorder_id: number | null;
  classification: string;
  is_servicerequest: number;
  priority: string | null;
  workorder_classification: number | null;
  contact_id: number | null;
  warranty_service: number;
  target_weeknumber: number | null;
  service_contact_name: string | null;
  service_contact_phone: string | null;
  service_contact_email: string | null;
  service_contact_priority: string | null;
  service_employee_group_id: number | null;
  contact_phone: string | null;
  contact_mobile: string | null;
  contact_email: string | null;
  is_active: number;
  recordtype_id: number | null;
  created_by: number;
  updated_by: number;
  created: string;
  updated: string;
  latitude: string | null;
  longitude: string | null;
  in_recyclebin: number | null;
};

export type FilteredServiceItem = {
  id: number;
  name: string;
  device_id: number;
  location_id: number | null;
  problem_description: string | null;
  image?: string;
  priority: string | null;
  created: string;
  updated: string;
  completed: string | null;
  is_completed: number;
  device_serial: string | null;
  device_brand: string | null;
  device_model: string | null;
  description: string | null; // Työnselostus
};

export interface IssueFormValues {
  id?: number;
  location_id?: number | string | undefined; // Huoltotarpeen kuvaus
  priority: string | null; // priority
  problem_description: string | null; // Huoltotarpeen kuvaus
  type: string | null; // type
  instruction: string | null; // AI:n Ehdotettu huolto-ohje
  missing_equipments: string | null; // Tarvittavat työkalut
};

export interface FurnitureInfo {
  name: string | null;
  model: string | null;
  brand: string | null;
  problem_description: string | null;
}

export const issuesData: ServiceTask[] = [
  {
    id: 5,
    name: "Huoltopyyntö",
    approved_by_contact: null,
    approved: null,
    customer_responsibility: null,
    description: null,
    instruction: "Älyä-avustaja suosittelee huoltoa 2 vuoden välein.",
    summary: null,
    identifier: null,
    device_id: 3,
    device_serial: "100",
    device_brand: "",
    device_model: '"Yleistuoli" tai muu nimeäminen',
    account_id: 1,
    location_id: null,
    approved_by_client: null,
    serviceprogram_id: null,
    serviceschedule_id: null,
    serviceschedule_target_date: null,
    opportunity_id: null,
    lineitem_id: null,
    type: "Selkänoja heiluu",
    begins: null,
    ends: null,
    begins_time: null,
    ends_time: null,
    completed: null,
    is_completed: 0,
    hours: null,
    workload: null,
    is_statutory: 0,
    maintenance_interval_logged: null,
    device_hours_logged: null,
    result: "{{{TRANSLATE_CONTENT}}}picklist_service_result_pending",
    hourcomposition_id: null,
    review_source: null,
    review_followup: null,
    person_id: "1",
    employee_id: null,
    next_service_id: null,
    next_service_description: null,
    missing_equipments: "Jalkanasta,V2-kangas",
    used_equipments: null,
    purchase_suggestion: null,
    repair_deficit: null,
    group_id: null,
    payer_id: null,
    instruction_file_id: null,
    problem_description: "Verhoilun kangas on kulunut ja selkänoja heiluu.",
    task_id: null,
    reviewpattern_id: null,
    workorder_id: null,
    classification:
      "{{{TRANSLATE_CONTENT}}}picklist_service_classification_maintenance_request",
    is_servicerequest: 1,
    priority: "Huomioitava",
    workorder_classification: null,
    contact_id: 2,
    warranty_service: 0,
    target_weeknumber: null,
    service_contact_name: "Eero Esimerkki",
    service_contact_phone: "044 5000460",
    service_contact_email: null,
    service_contact_priority: null,
    service_employee_group_id: null,
    contact_phone: "044 5000460",
    contact_mobile: null,
    contact_email: null,
    is_active: 1,
    recordtype_id: null,
    created_by: 0,
    updated_by: 0,
    created: "2024-06-05 06:41:24",
    updated: "2024-06-05 06:41:24",
    latitude: null,
    longitude: null,
    in_recyclebin: null,
  },
  {
    id: 6,
    name: "Huoltopyyntö",
    approved_by_contact: null,
    approved: null,
    customer_responsibility: null,
    description:
      "Tilattiin huolto korjattiin ja nyt voi istua taas hyvillä mielin.",
    instruction: "Älyä-avustaja suosittelee huoltoa 2 vuoden välein.",
    summary: null,
    identifier: null,
    device_id: 3,
    device_serial: "100",
    device_brand: "",
    device_model: '"Yleistuoli" tai muu nimeäminen',
    account_id: 1,
    location_id: null,
    approved_by_client: null,
    serviceprogram_id: 0,
    serviceschedule_id: null,
    serviceschedule_target_date: null,
    opportunity_id: null,
    lineitem_id: null,
    type: null,
    begins: null,
    ends: null,
    begins_time: null,
    ends_time: null,
    completed: "2024-06-05 06:50:24",
    is_completed: 1,
    hours: null,
    workload: null,
    is_statutory: 0,
    maintenance_interval_logged: null,
    device_hours_logged: null,
    result: "{{{TRANSLATE_CONTENT}}}picklist_service_result_done",
    hourcomposition_id: null,
    review_source: null,
    review_followup: null,
    person_id: null,
    employee_id: 1,
    next_service_id: null,
    next_service_description: null,
    missing_equipments: null,
    used_equipments: null,
    purchase_suggestion: null,
    repair_deficit: null,
    group_id: null,
    payer_id: null,
    instruction_file_id: null,
    problem_description: "Huoltotarpeen kuvaus. Selkänojasta puuttuu ruuvi.",
    task_id: null,
    reviewpattern_id: null,
    workorder_id: null,
    classification:
      "{{{TRANSLATE_CONTENT}}}picklist_service_classification_maintenance_request",
    is_servicerequest: 1,
    priority: "Huomioitava",
    workorder_classification: null,
    contact_id: null,
    warranty_service: 0,
    target_weeknumber: null,
    service_contact_name: null,
    service_contact_phone: null,
    service_contact_email: null,
    service_contact_priority: null,
    service_employee_group_id: null,
    contact_phone: null,
    contact_mobile: null,
    contact_email: null,
    is_active: 1,
    recordtype_id: null,
    created_by: 0,
    updated_by: 0,
    created: "2024-06-05 06:46:12",
    updated: "2024-06-05 06:51:02",
    latitude: null,
    longitude: null,
    in_recyclebin: null,
  },
  {
    id: 7,
    name: "Huoltopyyntö",
    approved_by_contact: null,
    approved: null,
    customer_responsibility: null,
    description: null,
    instruction: null,
    summary: null,
    identifier: null,
    device_id: 2,
    device_serial: "100",
    device_brand: "",
    device_model: '"Yleistuoli" tai muu nimeäminen',
    account_id: 1,
    location_id: null,
    approved_by_client: null,
    serviceprogram_id: null,
    serviceschedule_id: null,
    serviceschedule_target_date: null,
    opportunity_id: null,
    lineitem_id: null,
    type: "Runko heiluu",
    begins: null,
    ends: null,
    begins_time: null,
    ends_time: null,
    completed: null,
    is_completed: 0,
    hours: null,
    workload: null,
    is_statutory: 0,
    maintenance_interval_logged: null,
    device_hours_logged: null,
    result: "{{{TRANSLATE_CONTENT}}}picklist_service_result_pending",
    hourcomposition_id: null,
    review_source: null,
    review_followup: null,
    person_id: "1",
    employee_id: null,
    next_service_id: null,
    next_service_description: null,
    missing_equipments: null,
    used_equipments: null,
    purchase_suggestion: null,
    repair_deficit: null,
    group_id: null,
    payer_id: null,
    instruction_file_id: null,
    problem_description: "Testi vikailmoitus",
    task_id: null,
    reviewpattern_id: null,
    workorder_id: null,
    classification:
      "{{{TRANSLATE_CONTENT}}}picklist_service_classification_maintenance_request",
    is_servicerequest: 1,
    priority: "Kiireellinen",
    workorder_classification: null,
    contact_id: 2,
    warranty_service: 0,
    target_weeknumber: null,
    service_contact_name: "Eero Esimerkki",
    service_contact_phone: "044 5000460",
    service_contact_email: null,
    service_contact_priority: null,
    service_employee_group_id: null,
    contact_phone: "044 5000460",
    contact_mobile: null,
    contact_email: null,
    is_active: 1,
    recordtype_id: null,
    created_by: 0,
    updated_by: 0,
    created: "2024-06-07 09:01:43",
    updated: "2024-06-07 09:01:43",
    latitude: null,
    longitude: null,
    in_recyclebin: null,
  },
];

export const deviceData: DataDevice[] = [
  {
    custom_testi: null,
    id: 2,
    name: "Arena 300 pöytä",
    description: "Kuvaus",
    functionallocation_id: null,
    amount: null,
    status: "{{{TRANSLATE_CONTENT}}}picklist_devices_status_inownuse",
    serial: "",
    identifier: null,
    batch: null,
    location: "Neuvotteluhuone 101",
    location_extension: "",
    location_latitude: null,
    location_longitude: null,
    address_id: null,
    warehouse_id: null,
    controlroom_id: null,
    container_id: null,
    spreadsheettemplate_id: null,
    assembly_id: null,
    classification: null,
    ip: null,
    ip2: null,
    ip3: null,
    has_warehouse_service_program: 0,
    location_in_warehouse: null,
    location_in_warehouse_extension: null,
    previous_maintenance: null,
    next_maintenance: null,
    previous_inspection: null,
    previous_inspection_time: null,
    hours: null,
    total_hours: null,
    weekly_hours_avg: null,
    has_hours: 1,
    account_id: 1,
    contact_id: null,
    is_sold: 0,
    owner_account_id: 3,
    location_id: null,
    default_location_id: 4,
    opportunity_id: null,
    comissioning: null,
    manufacturing_year: null,
    devicecategory_id: 2,
    person_id: 1,
    image: 3,
    next_inspection: null,
    reviewpattern_id: 0,
    condition_mapping_template: null,
    previous_review_id: null,
    previous_review_time: null,
    waiting_for_pickup: 0,
    service_company: null,
    service_company_phone: null,
    service_company_email: null,
    weight: null,
    measurements: null,
    seller_id: null,
    manufacturer_id: null,
    brand: "Merkki",
    model: "Malli",
    type: null,
    warranty_period: null,
    warranty_ends: null,
    warranty_terms: null,
    account_service_responsibility: 1,
    qr_code: "1H37Q.4X2TNM0",
    product_id: 5,
    employee_id: null,
    serviceprogram_id: null,
    device_id: null,
    service_catalogitem_id: null,
    created_by_employee: null,
    usage_prohibited: 0,
    reason_for_probited_usage: null,
    prohibited_usage_classification: null,
    disposal_recommendation: 0,
    reason_for_disposal_recommendation: "",
    disposal_recommendation_classification: null,
    disposed: 0,
    missing: 0,
    allow_lease: 1,
    usage_prohibitation_ends: null,
    is_active: 1,
    recordtype_id: null,
    created_by: 1,
    updated_by: 1,
    created: "2024-06-05 05:40:30",
    updated: "2024-06-05 05:40:30",
    latitude: null,
    longitude: null,
    in_recyclebin: null,
    image_url: "/chairs/arena022.jpg",
  },
  {
    custom_testi: null,
    id: 3,
    name: "Arena 022",
    description: "Hieno tuoli",
    functionallocation_id: null,
    amount: null,
    status: "{{{TRANSLATE_CONTENT}}}picklist_devices_status_inownuse",
    serial: "100",
    identifier: null,
    batch: null,
    location: "Neuvotteluhuone 101",
    location_extension: "Sijainnin tarkenne",
    location_latitude: null,
    location_longitude: null,
    address_id: null,
    warehouse_id: null,
    controlroom_id: null,
    container_id: null,
    spreadsheettemplate_id: null,
    assembly_id: null,
    classification: null,
    ip: null,
    ip2: null,
    ip3: null,
    has_warehouse_service_program: 0,
    location_in_warehouse: null,
    location_in_warehouse_extension: null,
    previous_maintenance: null,
    next_maintenance: null,
    previous_inspection: null,
    previous_inspection_time: null,
    hours: null,
    total_hours: null,
    weekly_hours_avg: null,
    has_hours: 1,
    account_id: 1,
    contact_id: null,
    is_sold: 0,
    owner_account_id: 3,
    location_id: null,
    default_location_id: 4,
    opportunity_id: null,
    comissioning: null,
    manufacturing_year: null,
    devicecategory_id: 9,
    person_id: 1,
    image: 8,
    next_inspection: null,
    reviewpattern_id: 0,
    condition_mapping_template: null,
    previous_review_id: null,
    previous_review_time: null,
    waiting_for_pickup: 0,
    service_company: null,
    service_company_phone: null,
    service_company_email: null,
    weight: null,
    measurements: null,
    seller_id: null,
    manufacturer_id: null,
    brand: "tuolin merkki",
    model: "\"Yleistuoli\" tai muu nimeäminen",
    type: null,
    warranty_period: null,
    warranty_ends: null,
    warranty_terms: null,
    account_service_responsibility: 1,
    qr_code: "1H37Q.4X4JOW0",
    product_id: 6,
    employee_id: null,
    serviceprogram_id: null,
    device_id: null,
    service_catalogitem_id: null,
    created_by_employee: null,
    usage_prohibited: 0,
    reason_for_probited_usage: null,
    prohibited_usage_classification: null,
    disposal_recommendation: 0,
    reason_for_disposal_recommendation: "",
    disposal_recommendation_classification: null,
    disposed: 0,
    missing: 0,
    allow_lease: 1,
    usage_prohibitation_ends: null,
    is_active: 1,
    recordtype_id: null,
    created_by: 1,
    updated_by: 1,
    created: "2024-06-05 06:07:47",
    updated: "2024-06-07 07:43:39",
    latitude: null,
    longitude: null,
    in_recyclebin: null,
    image_url: "/chairs/arena022.jpg",
  },
];

export const locationData: Location[] = [{
  id: 4,
  name: "Neuvotteluhuone 101",
  street: null,
  zip: null,
  city: null,
  region: null,
  country: "",
  invoice_address: null,
  invoice_routercode: null,
  description: "",
  created_by_employee: null,
  name_extension: "Neuvotteluhuone 101",
  number: "",
  qr_code: null,
  reviewpattern_id: null,
  condition_mapping_template: null,
  previous_review_id: null,
  previous_review_time: null,
  account_id: 3,
  parent_id: null,
  contract_id: null,
  previous_maintenance: null,
  next_maintenance: "2024-06-05",
  billing_account_id: null,
  www: null,
  image: null,
  address_id: null,
  coordinates: null,
  type: null,
  service_contact_id: null,
  service_account_id: null,
  user_id: null,
  serviceprogram_id: null,
  stage: null,
  device_amount: null,
  device_amount_default: 0,
  potential: null,
  is_active: 1,
  recordtype_id: null,
  created_by: 1,
  updated_by: 1,
  created: "2024-06-04 07:59:50",
  updated: "2024-06-05 05:37:37",
  latitude: null,
  longitude: null,
  in_recyclebin: null
}];