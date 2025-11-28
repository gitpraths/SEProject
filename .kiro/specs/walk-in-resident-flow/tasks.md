# Implementation Plan

- [x] 1. Update type definitions and API layer
  - Update ShelterResident type to include optional photo and notes fields
  - Add createWalkInResident API function with proper typing
  - Ensure backward compatibility with existing resident fields
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 2. Create WalkInForm component with validation
  - [x] 2.1 Implement form structure with React Hook Form and Zod schema
    - Create WalkInForm.tsx component with required fields (name, age, gender)
    - Add optional fields (photo upload, intake notes)
    - Implement Zod validation schema with proper error messages
    - Set up form state management with React Hook Form
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.7, 10.1, 10.2, 10.3_
  
  - [x] 2.2 Implement photo upload with base64 conversion
    - Add file input with image type validation
    - Create base64 conversion utility function
    - Implement photo preview with remove functionality
    - Add file size validation (5MB limit)
    - Display loading state during conversion
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 2.3 Implement form submission and error handling
    - Connect form to createWalkInResident API function
    - Extract shelterId from session storage
    - Handle success with toast notification and modal close
    - Handle errors with appropriate error messages
    - Handle offline mode with queued action feedback
    - _Requirements: 2.6, 2.7, 6.3, 6.4, 6.5, 10.4, 10.5, 10.6_
  
  - [x] 2.4 Apply UI styling and animations
    - Style form with cream/beige theme colors
    - Add rounded-2xl borders and smooth transitions
    - Implement focus states for inputs
    - Add loading state to submit button
    - Style error messages with red text and fade-in animation
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 3. Implement MSW handler for walk-in endpoint
  - [x] 3.1 Create POST handler for /api/shelter/residents/walkin
    - Add new route handler in shelterResidentsHandlers.ts
    - Generate unique ID using crypto.randomUUID()
    - Set admittedAt to current ISO timestamp
    - Set bedNumber to null by default
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [x] 3.2 Implement localStorage persistence
    - Read existing residents from mock_shelter_residents
    - Append new resident to array
    - Save updated array back to localStorage
    - Preserve all existing resident data
    - _Requirements: 5.5, 5.6, 5.7_
  
  - [x] 3.3 Update bed occupancy statistics
    - Create helper function to update bed stats
    - Increment occupiedBeds count for shelterId
    - Save updated stats to localStorage
    - Return success response with created resident
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 4. Update AddResidentModal component
  - Replace existing form content with WalkInForm component
  - Update modal title to "Add Walk-In Resident"
  - Pass onClose handler to WalkInForm
  - Ensure modal animations remain consistent
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 5. Integrate with residents page and dashboard
  - [x] 5.1 Implement query invalidation
    - Invalidate shelter-residents query after successful creation
    - Invalidate shelter-stats query to update dashboard
    - Ensure automatic refetch of residents list
    - Verify dashboard occupancy updates in real-time
    - _Requirements: 6.1, 6.2, 6.6, 7.1, 7.2, 7.3, 7.4_
  
  - [x] 5.2 Add activity logging
    - Log "Added walk-in resident: [name]" action
    - Include resident ID and name in metadata
    - Set category to "shelter"
    - Verify log appears in activity feed
    - _Requirements: 6.4_
  
  - [x] 5.3 Verify residents page integration
    - Ensure "Add Resident" button opens modal
    - Verify new resident appears in list immediately
    - Check that photo displays in resident card if provided
    - Confirm notes are saved and accessible
    - Test search and filter functionality with new residents
    - _Requirements: 6.6, 9.1_

- [x] 6. Verify end-to-end functionality
  - Test complete flow from button click to list update
  - Verify form validation for all fields
  - Test photo upload with various file types and sizes
  - Confirm offline mode queues action properly
  - Verify dashboard statistics update correctly
  - Test with only required fields (no photo/notes)
  - Test with all fields populated
  - Verify activity log entries are created
  - Check mobile responsiveness
  - _Requirements: All requirements_

