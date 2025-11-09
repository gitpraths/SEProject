import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

export const Allocation = sequelize.define("Allocation", {
  alloc_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  profile_id: { type: DataTypes.INTEGER, allowNull: false },
  shelter_id: { type: DataTypes.INTEGER },
  job_id: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING, defaultValue: "pending" },
});