import express from "express";
import { Allocation } from "../pg_models/allocation.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create new assignment
router.post("/", protect, async (req, res) => {
  try {
    const {
      profile_id,
      resource_id,
      resource_type,
      resource_name,
      status = 'assigned'
    } = req.body;

    // Import HomelessProfile model
    const { HomelessProfile } = await import("../pg_models/homelessProfile.js");

    // Get current profile to check existing status
    const profile = await HomelessProfile.findByPk(profile_id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Create assignment record
    const assignment = await Allocation.create({
      profile_id: parseInt(profile_id),
      shelter_id: resource_type === 'shelter' ? parseInt(resource_id) : null,
      job_id: resource_type === 'job' ? parseInt(resource_id) : null,
      resource_type,
      resource_name,
      status,
      assigned_by: req.user.user_id,
      assigned_at: new Date(),
    });

    // Update profile status based on assignment type
    let newStatus = profile.status;
    let updateData = {
      status_updated_at: new Date()
    };

    if (resource_type === 'shelter') {
      updateData.current_shelter = resource_name;
      
      // Determine new status
      if (profile.status === 'job_requested') {
        newStatus = 'both_requested';
      } else {
        newStatus = 'shelter_requested';
      }
    } else if (resource_type === 'job') {
      updateData.current_job = resource_name;
      
      // Determine new status
      if (profile.status === 'shelter_requested') {
        newStatus = 'both_requested';
      } else {
        newStatus = 'job_requested';
      }
    }

    updateData.status = newStatus;

    // Update the profile
    await profile.update(updateData);

    console.log(`✅ Assignment created: ${resource_type} "${resource_name}" assigned to profile ${profile_id}`);
    console.log(`✅ Profile status updated: ${profile.status} → ${newStatus}`);

    res.status(201).json({
      message: `${resource_type} assigned successfully`,
      assignment,
      profile_status: newStatus,
      status_message: getStatusMessage(newStatus, resource_name, resource_type)
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ error: "Failed to create assignment" });
  }
});

// Helper function to get user-friendly status messages
function getStatusMessage(status, resourceName, resourceType) {
  const messages = {
    'shelter_requested': `Request sent to ${resourceName} shelter on behalf of this person`,
    'job_requested': `Request sent to ${resourceName} organization for job placement`,
    'both_requested': `Requests sent to both shelter and job organization`,
    'shelter_assigned': `Successfully placed in ${resourceName} shelter`,
    'job_assigned': `Successfully employed at ${resourceName}`,
    'completed': 'Successfully housed and employed',
    'active': 'Looking for assistance'
  };
  return messages[status] || status;
}

// Get assignments for a profile
router.get("/profile/:profile_id", protect, async (req, res) => {
  try {
    const assignments = await Allocation.findAll({
      where: { profile_id: req.params.profile_id }
    });
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

// Get all assignments
router.get("/", protect, async (req, res) => {
  try {
    const assignments = await Allocation.findAll();
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

export default router;