export const VEHICLE_TABLE_NAME = "vehicle";
export const COLUMNS_FOR_UPDATE = [
  "vehicle_name",
  "vehicle_model",
  "plate_number",
  "vehicle_type",
];
export const VEHICLE_ID_COLUMN = "vehicle_id";
export const PLATE_NUMBER_COLUMN = "plate_number"
export const VEHICLE_TYPE_COLUMN = 'vehicle_type';
export const ALLOWED_VEHICLE_PROPERTIES = ["vehicle_name", "plate_number", "vehicle_type", "vehicle_model", "insurance_details", "road_worthy", "vehicle_id"]
export const VEHICLE_TYPE = ["car", "motor", "truck" ]
export const CLIENT_SORT_COLUMNS = [
  "Name",
  "Type",
  "Model",
  "Number Plate",
  "Available",
]

export const CLIENT_COLS_DB_COLS_MAP= {
  "Name": "vehicle_name",
  "Type": "vehicle_type",
  "Model": "vehicle_model",
  "Number Plate": "plate_number",
  "Available": "available",
};