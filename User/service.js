const { UserRegistrationSchema } = require("./index");

const create = async (params) => {
  let newData;

  try {
    newData = await UserRegistrationSchema.create(params);
  } catch (error) {
    console.error("Error in service create method:", error);
    throw error;
  }

  return newData;
};

const findUser = async (email) => {
  const data = await UserRegistrationSchema.findOne({ email: email });
  return data;
};

const getUserByEmail = async (email) => {
  return await UserRegistrationSchema.findOne({ email });
};

const lockUserAccount = async (userId) => {
  // const LOCK_TIME = 1 * 60 * 60 * 1000; // 1 hour
  const LOCK_TIME = 1 * 60 * 1000; // 1 min
  return await UserRegistrationSchema.findByIdAndUpdate(
    userId,
    {
      loginAttempts: 5,
      lockUntil: Date.now() + LOCK_TIME,
    },
    { new: true }
  );
};

const incrementLoginAttempts = async (userId) => {
  try {
    return await UserRegistrationSchema.findByIdAndUpdate(
      userId,
      { $inc: { loginAttempts: 1 } }, // Increment loginAttempts directly in the update
      { new: true }
    );
  } catch (error) {
    console.error("Error incrementing login attempts for user:", userId, error);
    throw error;
  }
};

const resetLoginAttempts = async (userId) => {
  try {
    return await UserRegistrationSchema.findByIdAndUpdate(
      userId,
      {
        loginAttempts: 0,
        lockUntil: null,
      },
      { new: true }
    );
  } catch (error) {
    console.error("Error resetting login attempts for user:", userId, error);
    throw error;
  }
};

const updateLastLoginAttempt = async (userId) => {
  try {
    await UserRegistrationSchema.findByIdAndUpdate(userId, {
      $set: { lastLoginAttempt: Date.now() },
    });
  } catch (error) {
    console.error("Error updating last login attempt for user:", userId, error);
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    return await UserRegistrationSchema.findById(userId);
  } catch (error) {
    console.error("Error getting user by ID:", userId, error);
    throw error;
  }
};

module.exports = {
  create,
  findUser,
  getUserByEmail,
  lockUserAccount,
  incrementLoginAttempts,
  resetLoginAttempts,
  updateLastLoginAttempt,
  getUserById,
};
