import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

export const HomelessProfile = sequelize.define("HomelessProfile", {
  profile_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },//PK
  name: { type: DataTypes.STRING, allowNull: false },
  alias: { type: DataTypes.STRING },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.STRING },
  health_status: { type: DataTypes.STRING },
  disabilities: { type: DataTypes.TEXT },
  education: { type: DataTypes.STRING },
  skills: { type: DataTypes.STRING },
  workHistory: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  geo_lat: { type: DataTypes.FLOAT },
  geo_lng: { type: DataTypes.FLOAT },
  needs: { type: DataTypes.TEXT },
  priority: { type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'), defaultValue: 'Medium' },
  registered_by: { type: DataTypes.INTEGER }, // FK -> User.user_id
});
