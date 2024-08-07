import {
  ALLOWED_DRIVER_UPDATE_PROPERTIES,
  GET_DRIVER_COLUMNS,
} from "../constants/driverConstants.js";
import { DEFAULT_LIMIT } from "../constants/sharedConstants.js";
import {
  addDriverToDB,
  deleteDriverFromDB,
  getAllDriversFromDB,
  getDriversCount,
  getOneDriverFromDB,
  updateDriverOnDB,
} from "../model/driver.model.js";
import { getSpecificUserDetailsUsingId } from "../model/user.model.js";
import { getOneVehicleFromDB } from "../model/vehicle.model.js";
import { errorHandler } from "../utils/errorHandler.js";
import { allowedPropertiesOnly, userIsUserRole } from "../utils/util.js";
import { getAllEntitiesService } from "./helpers.service.js";

export const getAllDriversService = async (
  page,
  limit = DEFAULT_LIMIT,
  sortColumn,
  sortDirection,
  search
) => {
  
  try {
    const drivers = await getAllEntitiesService(
      page,
      limit ,
      sortColumn,
      sortDirection,
      search,
      getAllDriversFromDB,
      getDriversCount,
      "drivers"
    );
    return drivers;
  } catch (err) {
    
    return errorHandler(
      "server error occurred getting drivers",
      `${err}`,
      500,
      "get all drivers service"
    );
  }
};

export const getOneDriverService = async (driver_id, requester_user_id) => {
  try {
    const driver = await getOneDriverFromDB(driver_id);
    if (driver.error) {
      return { error: driver.error };
    }

    let driverDetails = { ...driver };
    const { user_id } = driver;

    //fetching driver name and related details
    const isAdmin = await userIsUserRole(requester_user_id, "Admin");

    isAdmin ? GET_DRIVER_COLUMNS.push("email") : "";
    const driverNamePhone = await getSpecificUserDetailsUsingId(
      user_id,
      GET_DRIVER_COLUMNS
    );
    if (driverNamePhone.error) {
      return { error: driverNamePhone.error };
    }
    driverDetails = { ...driver, ...driverNamePhone[0] };

    const vehicle_id = driver.vehicle_id;

    const vehicleDetails = await getOneVehicleFromDB(vehicle_id);
    if (vehicleDetails.error) {
      return { ...driver, vehicle: "No vehicle assigned" };
    }
    return { ...driverDetails, vehicle: vehicleDetails };
  } catch (err) {
    return errorHandler(
      "Error occurred getting one driver",
      `${err}`,
      500,
      "service"
    );
  }
};

export const addDriverService = async (user_id, vehicle_id) => {
  const driverAdd = await addDriverToDB(user_id, vehicle_id);
  if (driverAdd.error) {
    return driverAdd.error; 
  }
  return driverAdd;
};

export const updateDriverService = async (driverDetails) => {
  try {
    const validDriverDetails = allowedPropertiesOnly(
      driverDetails,
      ALLOWED_DRIVER_UPDATE_PROPERTIES
    );
    const driverUpdate = await updateDriverOnDB(validDriverDetails);
    if (driverUpdate.error) {
      return { error: driverUpdate.error };
    }
    return driverUpdate;
  } catch (err) {
    return errorHandler(
      "Error occurred updating driver details",
      `${err}`,
      500,
      "service"
    );
  }
};

export const deleteDriverService = async (driver_id) => {
  try {
    const driverDelete = await deleteDriverFromDB(driver_id);
    if (driverDelete.error) {
      return driverDelete.error;
    }
    return driverDelete;
  } catch (err) {
    return errorHandler(
      "Server Error occurred deleting driver",
      `${err}`,
      500,
      "Driver Service"
    );
  }
};
