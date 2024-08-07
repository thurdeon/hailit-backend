
import { userIsUserRole, userAssociatedWithTrip } from '../../utils/util.js';

export const tripAuth = async (req, res, next)=> {
    
    try {
      const path = req.path;
      const {
        dispatcher_id = "",
        user_id = "",
        user_role = "Customer",
      } = req.user;

      const { trip_id } = req.params;
      const isAdmin = await userIsUserRole(user_id, "Admin");

      //in trips 'dispatcher' represents both rider and driver

      if (
        path.includes("/rate-trip/") &&
        (user_role === "Driver" || user_role === "Rider")
      ) {
        return res.status(401).json({ error: "You cannot access trip" });
      }

      let tripAssociation = false;

      user_role === "Rider" || user_role === "Driver"
        ? (tripAssociation = await userAssociatedWithTrip(
            dispatcher_id,
            trip_id,
            
          ))
        : (tripAssociation = await userAssociatedWithTrip(
            user_id,
            trip_id,
            user_role
          ));

      if (tripAssociation === true || isAdmin) {
        next();
      } else {
        return res.status(401).json({ error: "You cannot access trip" });
      }
    } catch (err) {
    
    return { error: `Trip Access Authorization error, ${err}` };
}

}



