
import { addUserService, deleteUserService, getAllUsersService, getOneUserService, getUserIdUsingEmailService, updateUserService} from "../services/user.service.js";
import { emailValidator, phoneValidator } from "../utils/util.js";
import { createClient } from "@supabase/supabase-js";

import {config} from 'dotenv';

config({ path: '../../../.env' });

export const getAllUsers = async (req, res) => {
  const page = req.query.page;
  
  try {
    const allUsers = await getAllUsersService(page);
    if(allUsers.error) {
      return res.status(allUsers.errorCode).json({error: allUsers.error, errorMessage: allUsers.errorMessage, errorSource: allUsers.errorSource})
    };

    if (page) {
      return res.status(200).json(allUsers);
    }
    if (res && res.status) {
      res.status(200).json({ users: allUsers });
      
    }
  } catch (err) {
    
    if (res && res.status) {
      res.status(500).json({ error: "Error occurred in getting all users ", errorMessage: err, errorSource: "User Controller" });
    }
  }
};

export const googleAuth = async (req, res) => {
  const code = req.query.c
  const accessToken = req.body
  const next = req.query.next ?? "/"

  

  if (code) {
    const supabase = createClient({ req, res })
    await supabase.auth.exchangeCodeForSession(code)
  }
}

export const getOneUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (res && res.status) {
      const oneUser = await getOneUserService(userId);
      if(oneUser.error) {
        return res.status(403).json({error: oneUser.error, errorMessage: oneUser.errorMessage, errorSource: oneUser.errorSource})
      }
      res.status(200).json({ user: oneUser });
    }
    

  } catch (err) {
    if (res && res.status) {
      res.status(500).json({ error: "Error occurred in getting user", errorMessage: err, errorSource: "User Controller" });
    }
  }
};

export const getUserIdUsingEmail = async (req, res) => {
  try {
    const { email } = req.query;

    const userDetails = await getUserIdUsingEmailService(email);
    if(userDetails.error) {
      return res.status(userDetails.errorCode).json({error: userDetails.error, errorMessage: userDetails.errorMessage, errorSource: userDetails.errorSource})
    }
    res.status(200).json({ user: userDetails });
  } catch (err) {
    res.status(500).json({ error: "Error occurred in getting user ID", errorMessage: err, errorSource: "User Controller" });
  }
};

export const addUser = async (req, res) => {
  try {
    const { user_id, email } = req.body;
    

    if (!user_id || !email) {
      return res.status(400).json({ error: "all fields are required", errorMessage: "Missing user_id or user_email", errorSource: "User Controller" });
    }
    if (!emailValidator(email)) {
      return res.status(400).json({ error: "enter a correct email", errorMessage: "Wrong email submitted", errorSource: "User Controller" });
    }

    const userDetails = req.body;
    const addingUser = await addUserService(userDetails);

    if (addingUser.error) {
      return res.status(403).json({ error: addingUser.error, errorMessage: addingUser.errorMessage, errorSource: addingUser.errorSource });
    }
    

    res.status(200).json({ user: addingUser });
  } catch (err) {
    res.status(500).json({ error: "Error occurred in adding user", errorMessage: err, errorSource: "User Controller" });
  }
};
//updating user
export const updateUser = async (req, res) => {
  try {
    const {
      first_name = "" | "unknown",
      last_name = "" | "unknown",
      email = "",
      phone_number = "",
      user_role = "",
    } = req.body

    
    if (!first_name && !last_name && !email && !phone_number && !user_role) {
      return res.status(400).json({ error: "no information provided", errorMessage: "Request missing first_name, last_name, email, phone_number, and user_role", errorSource: "User Controller" });
    }

    if (!phoneValidator(phone_number)) {
      res.status(400).json({ error: "Enter correct phone number", errorMessage: "Phone number incorrect", errorSource: "User Controller" });
    }

    const { userId } = req.params;

    const userDetails = req.body;

    const updateUser = await updateUserService(userId, userDetails);
    if (updateUser.error) {
      return res.status(updateUser.errorCode).json({ error: updateUser.error, errorMessage: updateUser.errorMessage, errorSource: updateUser.errorSource });
    }
    res.status(200).json({user: updateUser});
  } catch (err) {
    res.status(500).json({ error: " Server error. user not updated", errorMessage: err, errorSource: "User Controller" });
  }
};
//deleting user detail
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userDelete = await deleteUserService(userId);
    if(userDelete.error) {
      return res.status(userDelete.errorCode).json(userDelete.errorMessage);
    }

    res.status(200).json(userDelete);
  } catch (err) {
    res.status(500).json({ error: " Server error user not deleted", errorMessage: err, errorSource: "User Controller" });
  }
};
