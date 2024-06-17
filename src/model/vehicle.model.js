import {
  addOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "./dBFunctions.js";

const tableName = "vehicle";
const columnsForUpdate = [
  "vehicle_name",
  "vehicle_model",
  "plate_number",
  "vehicle_type",
];
const columnsForAdding = ["vehicle_id", ...columnsForUpdate];
const vehicleIdColumn = "vehicle_id";

export const getAllVehiclesFromDB = async (limit, offset) => {
  try {
    const allVehicles = await getAll(tableName, limit, offset);
    
    return allVehicles;
  } catch (err) {
    return errorHandler(`Error occurred getting all vehicles`, `${err}`, 500, "Vehicle Model");
  }
};

export const getOneVehicleFromDB = async (vehicle_id) => {
  try {
    const getVehicle = await getOne(tableName, vehicleIdColumn, vehicle_id);
    if (getVehicle.error) {
      
      return errorHandler(
        "Vehicle does not exist",
        getVehicle.error,
        404,
        "Vehicle Model"
      );
    }

    return getVehicle[0];
  } catch (err) {
    return errorHandler(`Error occurred`, `${err}`, 500, "Vehicle Model");
  }
};

export const addVehicleToDB = async (completeVehicleDetails) => {
  const columnsForAdding = Object.keys(completeVehicleDetails);
  const vehicleDetailsArray = Object.values(completeVehicleDetails);
  const plate_number_column = "plate_number";
  const { plate_number } = completeVehicleDetails;
  try {
    const vehicleExists = await dbFunctions.detailExists(
      tableName,
      plate_number_column,
      plate_number
    );

    if (vehicleExists) {
      return errorHandler(
        "Vehicle exists. It has already been added",
        null,
        400,
        "Vehicle Model"
      );
    }
    const addVehicleResult = await addOne(
      tableName,
      columnsForAdding,
      vehicleDetailsArray
    );

    if (addVehicleResult.error) {
      return addVehicleResult //error details returned
    }

    return addVehicleResult[0];
  } catch (err) {
    return errorHandler(`Error occurred`, `${err}`, 500, "Vehicle Model");
  }
};

export const updateVehicleOnDB = async (vehicle_id, vehicleUpdateDetails) => {
  const validColumnsForUpdate = Object.keys(vehicleUpdateDetails);
  const vehicleDetails = Object.values(vehicleUpdateDetails);
  const vehicleIdColumn = columnsForAdding[0];

  try {
    const vehicleUpdate = await updateOne(
      tableName,
      validColumnsForUpdate,
      vehicle_id,
      vehicleIdColumn,
      ...vehicleDetails
    );
    if (vehicleUpdate.error) {
      return vehicleUpdate //Error details returned
    }

    return vehicleUpdate.rows[0];
  } catch (err) {
    return errorHandler(`Error occurred`, `${err}`, 500, "Vehicle Model");
  }
};

export const deleteVehicleFromDB = async (vehicle_id) => {
  try {
    const vehicleDeletion = await deleteOne(
      tableName,
      vehicleIdColumn,
      vehicle_id
    );

    
    return vehicleDeletion;
  } catch (err) {
    return errorHandler(`Error occurred`, `${err}`, 500, "Vehicle Model");
  }
};
