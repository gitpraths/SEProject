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

    // Import models
    const { HomelessProfile } = await import("../pg_models/homelessProfile.js");
    const { AssignmentRequest } = await import("../pg_models/assignmentRequest.js");

    // Get current profile to check existing status
    const profile = await HomelessProfile.findByPk(profile_id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // If assigning to shelter, create AssignmentRequest instead of direct assignment
    if (resource_type === 'shelter') {
      const request = await AssignmentRequest.create({
        profile_id: parseInt(profile_id),
        shelter_id: parseInt(resource_id),
        requested_by: req.user.user_id,
        status: 'pending',
        notes: `Request for ${resource_name}`
      });

      // Update profile status to show request sent
      await profile.update({
        status: profile.status === 'job_requested' ? 'both_requested' : 'shelter_requested',
        current_shelter: resource_name,
        status_updated_at: new Date()
      });

      console.log(`✅ Shelter assignment request created: ${resource_name} for profile ${profile_id}`);

      return res.status(201).json({
        message: `Shelter request sent to ${resource_name}`,
        request,
        profile_status: profile.status
      });
    }

    // For jobs, create direct allocation (existing logic)
    const assignment = await Allocation.create({
      profile_id: parseInt(profile_id),
      shelter_id: null,
      job_id: resource_type === 'job' ? parseInt(resource_id) : null,
      resource_type,
      resource_name,
      status,
      assigned_by: req.user.user_id,
      assigned_at: new Date(),
    });

    // Update profile status
    let newStatus = profile.status;
    let updateData = {
      status_updated_at: new Date()
    };

    if (resource_type === 'job') {
      updateData.current_job = resource_name;
      newStatus = profile.status === 'shelter_requested' ? 'both_requested' : 'job_requested';
    }

    updateData.status = newStatus;
    await profile.update(updateData);

    console.log(`✅ Assignment created: ${resource_type} "${resource_name}" assigned to profile ${profile_id}`);

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