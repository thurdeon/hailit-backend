import { errorHandler } from "../utils/errorHandler.js";
import { DEFAULT_USER_ID } from "../constants/usersConstants.js";
import {
  addTripService,
  getTripMonthsService,
  deleteTripService,
  getAllTripsService,
  getUserTripsService,
  searchTripService,
  currentMonthTripsCountService,
  rateTripService,
  updateTripService,
  getOneTripService,
  currentWeekTrip,
  tripsCountByMonth,
  getRevenueByMonth
} from "../services/trip.service.js";

export const getAllTrips = async (req, res) => {
  try {
    const page = req.query.page;
    
    const allTrips = await getAllTripsService(page);
    
    if(allTrips.error) {
      
      return res.status(allTrips.errorCode).json({error: allTrips.error, errorMessage: allTrips.errorMessage, errorSource: allTrips.errorSource})
    }
    
    
    res.status(200).json({ ...allTrips });

    
  } catch (err) {
    
    return res.status(500).json({ error: "Server Error occurred", errorMessage: err, errorSource: "Get All Trips Controller" });
  }
};

export const getOneTrip = async (req, res) => {
  
  try {
        
    const { trip_id } = req.params;
    
    const user_id = req.user?.sub;
    
    const oneTrip = await getOneTripService(trip_id, user_id);
    
    if (oneTrip.error) {
      return res.status(400).json({error: oneTrip.error, errorMessage: oneTrip.errorMessage, errorSource: oneTrip.errorSource})
    }
    res.status(200).json({ trip: oneTrip });
  } catch (err) {
    
    return res
      .status(500)
      .json({ error: "Server Error occurred getting trip", errorMessage: err, errorSource: "Trip Controller" });
  }
};

export const getUserTrips = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const userTrips = await getUserTripsService(user_id);
    
    if (userTrips.error) {
      return res.status(userTrips.errorCode).json({error: userTrips.error, errorMessage: userTrips.errorMessage, errorSource: userTrips.errorSource})
    }
    res.status(200).json({ trips: userTrips });
  } catch (err) {
    
    return res
      .status(500)
      .json({ error: "Server Error occurred getting user trips", errorMessage: err, errorSource: "User Trips Controller: Get User Trips" });
  }
};

export const addTrip = async (req, res) => {
  ///trip amount, trip_status, driver_id, trip_date, total amount, payment_status, delivery_time, payment_method, dispatcher_rating, rating_comment will be added in the service layer based on certain conditions
  
  try {
    
    
    const { trip_medium, trip_type, package_type, drop_off_location, pickup_location,  } =
      req.body;
    if (!trip_medium || !trip_type || !package_type || !drop_off_location || !pickup_location) {
  
      return res.status(400).json({
        error:
          "Provide all details: trip type, trip medium, sender number, recipient number, and package type",
      });
    }
  
    if (trip_medium) {
      const acceptedTripMediums = ["Motor", "Car", "Truck"];
      const validTripMedium = acceptedTripMediums.includes(trip_medium);
      if (!validTripMedium) {
        return res.status(403).json({ error: "Trip Medium Invalid" });
      }
    }
    const tripDetails = req.body;
    const  user_id  = req.user?.sub || DEFAULT_USER_ID;
    
    const tripAdded = await addTripService(user_id, tripDetails);
    if (tripAdded.error) {
      return res.status(400).json({error: tripAdded.error, errorMessage: tripAdded.errorMessage, errorSource: tripAdded.errorSource} );
    }
    res.status(200).json({trip: tripAdded})
  } catch (err) {
    
    return res
      .status(500)
      .json({ error: "Server Error occurred adding trip", errorMessage: err, errorSource: "Adding Trip Controller" });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;
    const tripDetails = { trip_id, ...req.body };
    
    const tripUpdate = await updateTripService(tripDetails);
    if(tripUpdate?.error) {
      return res.status(403).json({error: tripUpdate.error, errorMessage: tripUpdate.errorMessage, errorSource: tripUpdate.errorSource})
    }
    
      res.status(200).json({trip: tripUpdate} );
    
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server Error occurred updating trip", errorMessage: `${err}`, errorSource: "Trip Controller" });
  }
};

export const rateTrip = async (req, res) => {
  try {
    
    const ratingDetails = req.body;
    const { trip_id } = req.params;
    const detailsWithId = { trip_id, ...ratingDetails };
    const { dispatcher_rating } = req.body;
    if(typeof dispatcher_rating !== "number") {
      return res.status(403).json({ error: "Rating must be a number" });
    }
    if (!dispatcher_rating ) {
      return res.status(403).json({ error: "Driver/rider details missing" });
    }

    const tripRating = await rateTripService(detailsWithId);
    if(tripRating.error) {
      return res.status(400).json({error: tripRating.error, errorMessage: tripRating.errorMessage, errorSource: tripRating.errorSource})
    }
    
      res.status(200).json(tripRating);
    
    
    
  } catch (err) {
    return res.status(500).json({ error: "Server Error occurred", errorMessage: err, errorSource: "Trip Controller" });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;
    const tripDelete = await deleteTripService(trip_id);

    if (tripDelete.error) {
      return res.status(tripDelete.errorCode).json({error: tripDelete.error, errorMessage: tripDelete.errorMessage, errorSource: tripDelete.errorSource})
    }

    res.status(200).json({ success: "trip deleted" });
  } catch (err) {
    return res.status(500).json({error:"Error Occurred; Trip Not Deleted", errorMessage: err, errorSource: "Trip Controller"});
  }
};



export const searchTrips = async (req, res) => {
  try {

    const search = req.query.search
    
    const page = req.query.page || 1
    const searchResults = await searchTripService(search, page);
    if (searchResults.error) {
      
      return res.status(searchResults.errorCode).json({error:searchResults.error, searchResults: searchResults.errorMessage, errorSource: searchResults.errorSource})
    } 
    res.status(200).json({trips: searchResults})
  } catch (err) {
    return res.status(500).json({error:"Error Occurred; Trips not retrived", errorMessage: `${err}`, errorSource: "Trip Controller: Search Trips"});
  }
};


//TRIP STATS
export const getTripMonths = async (req, res) => {
  try {
    const tripMonths = await getTripMonthsService();
    if (tripMonths.error) {
      
      return res.status(tripMonths.errorCode).json({error: tripMonths.error, errorMessage: tripMonths.errorMessage, errorSource: tripMonths.errorSource})
    } 
    res.status(200).json({tripMonths})
  } catch (err) {
    return res.status(500).json({error:"Error Occurred; Trip Months Not Retrieved", errorMessage: err, errorSource: "Trip Controller. Trip Months"});
  }
};

//GET CURRENT WEEK TRIP COUNT
export const currentWeekTripCount = async (req, res) => {
  try {
    const currentWeekTrips = await currentWeekTrip();
    if (currentWeekTrips.error) {
      
      return res.status(currentWeekTrips.errorCode).json({error: currentWeekTrips.error, errorMessage: currentWeekTrips.errorMessage, errorSource: currentWeekTrips.errorSource})
    } 
    res.status(200).json({currentWeekTrips})
  } catch (err) {
    return res.status(500).json({error:"Error Occurred; Trip Months Not Retrieved", errorMessage: err, errorSource: "Trip Controller. Trip Months"});
  }
};

//GET CURRENT MONTH TRIP COUNT
export const getCurrentMonthTripCounts = async (req, res) => {
  try {
    const tripCounts = await currentMonthTripsCountService();
    if (tripCounts.error) {
      
      return res.status(tripCounts.errorCode).json({error: tripCounts.error, errorMessage: tripCounts.errorMessage, errorSource: tripCounts.errorSource})
    } 
    res.status(200).json({...tripCounts})
  } catch (err) {
    
    return res.status(500).json({error:"Error Occurred; Trip Months Not Retrieved", errorMessage: err, errorSource: "Trip Controller. Trip Months"});
  }
};

//GET TRIPS COUNT BY MONTHS (CURRENT + PREVIOUS MONTHS)
export const getTripsCountByMonth = async (req, res) => {
  try {
    const {trip_column, month, package_type, trip_area, trip_medium, trip_type, trip_status } =
      req.query;

      const tripProp = package_type || trip_area || trip_medium || trip_type || trip_status;
      const tripDataColumn = trip_column;
    const tripCounts = await tripsCountByMonth(tripDataColumn, tripProp, month );
    if (tripCounts.error) {
      
      return res.status(tripCounts.errorCode).json({error: tripCounts.error, errorMessage: tripCounts.errorMessage, errorSource: tripCounts.errorSource})
    } 
    res.status(200).json({...tripCounts})
  } catch (err) {
    
    return res.status(500).json({error:"Error Occurred; Trip Months Not Retrieved", errorMessage: err, errorSource: "Trip Controller. Trip Months"});
  }
};

export const getTripRevenueByMonth = async (req, res) => {
  try {
    
    const tripRevenue= await getRevenueByMonth( );
    if (tripRevenue.error) {
      
      return res.status(tripRevenue.errorCode).json({error: tripRevenue.error, errorMessage: tripRevenue.errorMessage, errorSource: tripRevenue.errorSource})
    } 
    res.status(200).json({...tripRevenue})
  } catch (err) {
    
    return res.status(500).json({error:"Error Occurred; Trip Revenue Not Retrieved", errorMessage: err, errorSource: "Trip Controller: Trip Revenue"});
  }
};




