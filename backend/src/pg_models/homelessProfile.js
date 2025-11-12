import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

export const HomelessProfile = sequelize.define("HomelessProfile", {
  profile_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },//PK
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.STRING },
  health_status: { type: DataTypes.STRING },
  education: { type: DataTypes.STRING },
  skills: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  registered_by: { type: DataTypes.INTEGER }, // FK -> User.user_id
});
