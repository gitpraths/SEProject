// src/pg_models/index.js

// Import models (remove the duplicate side-effect imports)
import { User } from "./user.js";
import { HomelessProfile } from "./homelessProfile.js";
import { Shelter } from "./shelter.js";
import { Job } from "./job.js";
import { Allocation } from "./allocation.js";
import { MedicalRecord } from "./medicalRecord.js";

// Define associations here
User.hasMany(HomelessProfile, { foreignKey: "registered_by" });
HomelessProfile.belongsTo(User, { foreignKey: "registered_by" });

HomelessProfile.hasMany(Allocation, { foreignKey: "profile_id" });
Allocation.belongsTo(HomelessProfile, { foreignKey: "profile_id" });

Shelter.hasMany(Allocation, { foreignKey: "shelter_id" });
Allocation.belongsTo(Shelter, { foreignKey: "shelter_id" });

Job.hasMany(Allocation, { foreignKey: "job_id" });
Allocation.belongsTo(Job, { foreignKey: "job_id" });

HomelessProfile.hasMany(MedicalRecord, { foreignKey: "profile_id" });
MedicalRecord.belongsTo(HomelessProfile, { foreignKey: "profile_id" });

console.log("✅ Models imported and associations created");

// Export all models for use elsewhere if needed
export { User, HomelessProfile, Shelter, Job, Allocation, MedicalRecord };