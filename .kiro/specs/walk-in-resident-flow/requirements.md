# Requirements Document

## Introduction

This document specifies the requirements for improving the walk-in resident creation flow in the Shelter interface. The enhancement focuses on providing shelter staff with a streamlined, user-friendly form to quickly register walk-in residents with optional photo capture and intake notes, ensuring immediate data persistence and dashboard updates.

## Glossary

- **Walk-In Resident**: A homeless individual who arrives at the shelter without a prior request or referral and needs immediate registration
- **Shelter System**: The collection of pages and components that enable shelter staff to manage requests, residents, and medical records
- **Base64 Encoding**: A method of encoding binary image data as text for storage and transmission
- **MSW (Mock Service Worker)**: Development tool that intercepts API requests and provides mock responses with localStorage persistence
- **Query Invalidation**: React Query mechanism that triggers automatic data refetch after mutations
- **Activity Log**: System-wide logging mechanism that records user actions for audit and display purposes

## Requirements

### Requirement 1: Enhanced Resident Data Model

**User Story:** As a shelter staff member, I want to capture additional information about walk-in residents including photos and intake notes, so that I have a complete record from the moment of admission.

#### Acceptance Criteria

1. WHEN the ShelterResident type is defined, THEN THE Shelter System SHALL include optional fields for photo (base64 string), notes (string), and bedNumber (string or null)
2. WHEN a resident record is created, THEN THE Shelter System SHALL accept null values for optional fields without validation errors
3. WHEN a resident photo is stored, THEN THE Shelter System SHALL store the image as a base64-encoded string
4. WHEN a resident record is retrieved, THEN THE Shelter System SHALL return all fields including optional photo and notes
5. WHERE a resident has a photo, THE Shelter System SHALL display the photo in the resident card and profile views

### Requirement 2: Walk-In Resident Form

**User Story:** As a shelter staff member, I want a dedicated form for registering walk-in residents with clear fields and validation, so that I can quickly and accurately capture their information.

#### Acceptance Criteria

1. WHEN the walk-in form is displayed, THEN THE Shelter System SHALL render input fields for name (required), age (required number), gender (required select), photo (optional file upload), and intake notes (optional textarea)
2. WHEN a user enters data in the name field, THEN THE Shelter System SHALL validate that the name is not empty
3. WHEN a user enters data in the age field, THEN THE Shelter System SHALL validate that the age is a positive number between 1 and 120
4. WHEN a user selects a gender, THEN THE Shelter System SHALL provide options for Male, Female, and Other
5. WHEN a user uploads a photo file, THEN THE Shelter System SHALL convert the file to base64 format and display a preview
6. WHEN a user submits the form with invalid data, THEN THE Shelter System SHALL display field-specific error messages
7. WHEN a user submits the form with valid data, THEN THE Shelter System SHALL call the createWalkInResident API function

### Requirement 3: Photo Upload and Preview

**User Story:** As a shelter staff member, I want to upload a photo of the walk-in resident and see a preview before submitting, so that I can verify the correct image is captured.

#### Acceptance Criteria

1. WHEN a user clicks the photo upload field, THEN THE Shelter System SHALL open a file picker accepting image formats (jpg, jpeg, png, gif)
2. WHEN a user selects an image file, THEN THE Shelter System SHALL convert the file to base64 format
3. WHEN an image is converted to base64, THEN THE Shelter System SHALL display a preview of the image in the form
4. WHEN a user uploads an image larger than 5MB, THEN THE Shelter System SHALL display a warning message
5. WHERE a photo preview is displayed, THE Shelter System SHALL provide a button to remove the photo and select a different one

### Requirement 4: API Integration

**User Story:** As a developer, I want a dedicated API function for creating walk-in residents, so that the form can submit data to the backend with proper error handling.

#### Acceptance Criteria

1. WHEN the createWalkInResident function is called, THEN THE Shelter System SHALL send a POST request to "/api/shelter/residents/walkin"
2. WHEN the API request is sent, THEN THE Shelter System SHALL include name, age, gender, shelterId, photo, and notes in the request body
3. WHEN the API request succeeds, THEN THE Shelter System SHALL return the created resident object with a generated ID
4. WHEN the API request fails, THEN THE Shelter System SHALL throw an error with a descriptive message
5. WHERE the request body contains a photo, THE Shelter System SHALL include the full base64-encoded string

### Requirement 5: MSW Handler for Walk-In Creation

**User Story:** As a developer, I want a mock service worker handler for walk-in resident creation, so that the feature works in development with realistic data persistence.

#### Acceptance Criteria

1. WHEN a POST request is made to "/api/shelter/residents/walkin", THEN THE MSW Handler SHALL intercept the request
2. WHEN the handler processes the request, THEN THE MSW Handler SHALL generate a unique ID using crypto.randomUUID()
3. WHEN the handler creates a resident record, THEN THE MSW Handler SHALL set admittedAt to the current ISO timestamp
4. WHEN the handler creates a resident record, THEN THE MSW Handler SHALL set bedNumber to null by default
5. WHEN the handler saves the resident, THEN THE MSW Handler SHALL append the new resident to the existing residents array in localStorage under "mock_shelter_residents"
6. WHEN the handler completes, THEN THE MSW Handler SHALL return a response with success: true and the created resident object
7. WHERE localStorage contains existing residents, THE MSW Handler SHALL preserve all existing data while adding the new resident

### Requirement 6: Form Submission and Data Refresh

**User Story:** As a shelter staff member, I want the residents list to update immediately after I add a walk-in resident, so that I can see the new resident without manually refreshing.

#### Acceptance Criteria

1. WHEN the walk-in form is submitted successfully, THEN THE Shelter System SHALL invalidate the "shelter-residents" query for the current shelterId
2. WHEN the query is invalidated, THEN THE Shelter System SHALL automatically refetch the residents list
3. WHEN the form submission succeeds, THEN THE Shelter System SHALL display a success toast message with the resident's name
4. WHEN the form submission succeeds, THEN THE Shelter System SHALL log an activity entry "Added walk-in resident: [name]"
5. WHEN the form submission succeeds, THEN THE Shelter System SHALL close the modal
6. WHEN the residents list is refetched, THEN THE Shelter System SHALL display the new resident in the list without page reload

### Requirement 7: Dashboard Integration

**User Story:** As a shelter manager, I want the dashboard bed occupancy statistics to update automatically when a walk-in resident is added, so that I have accurate real-time data.

#### Acceptance Criteria

1. WHEN a walk-in resident is added, THEN THE Shelter System SHALL invalidate the "shelter-stats" query
2. WHEN the shelter stats query is invalidated, THEN THE Shelter System SHALL refetch the dashboard statistics
3. WHEN the dashboard statistics are refetched, THEN THE Shelter System SHALL display the updated occupied bed count
4. WHEN the dashboard statistics are refetched, THEN THE Shelter System SHALL display the updated occupancy percentage
5. WHERE the shelter reaches full capacity, THE Shelter System SHALL display the occupancy card with a visual indicator

### Requirement 8: UI Design and Theme Consistency

**User Story:** As a shelter staff member, I want the walk-in form to match the existing shelter interface design, so that the experience feels cohesive and professional.

#### Acceptance Criteria

1. WHEN the walk-in form is displayed, THEN THE Shelter System SHALL use a cream-colored card background (bg-[#FFF8E7])
2. WHEN the walk-in form is displayed, THEN THE Shelter System SHALL use rounded-2xl border radius
3. WHEN input fields are rendered, THEN THE Shelter System SHALL apply smooth focus transitions and border styling
4. WHEN the form is submitted, THEN THE Shelter System SHALL display a loading state on the submit button
5. WHERE validation errors exist, THE Shelter System SHALL display error messages in red text below the relevant field
6. WHERE the photo preview is shown, THE Shelter System SHALL display the image with rounded corners and a border

### Requirement 9: Modal Integration

**User Story:** As a shelter staff member, I want to access the walk-in form through the existing "Add Resident" button, so that the workflow is intuitive and consistent.

#### Acceptance Criteria

1. WHEN a user clicks the "Add Resident" button on the residents page, THEN THE Shelter System SHALL open the AddResidentModal
2. WHEN the AddResidentModal opens, THEN THE Shelter System SHALL render the WalkInForm component
3. WHEN the WalkInForm is submitted successfully, THEN THE Shelter System SHALL close the AddResidentModal
4. WHEN the user clicks outside the modal or presses Escape, THEN THE Shelter System SHALL close the modal without submitting
5. WHERE the modal is open, THE Shelter System SHALL prevent scrolling on the background page

### Requirement 10: Form Validation and Error Handling

**User Story:** As a shelter staff member, I want clear validation messages and error handling, so that I understand what needs to be corrected before submitting the form.

#### Acceptance Criteria

1. WHEN the form is submitted with an empty name field, THEN THE Shelter System SHALL display "Name is required"
2. WHEN the form is submitted with an invalid age, THEN THE Shelter System SHALL display "Age must be between 1 and 120"
3. WHEN the form is submitted without selecting a gender, THEN THE Shelter System SHALL display "Gender is required"
4. WHEN the API request fails, THEN THE Shelter System SHALL display an error toast with the failure message
5. WHEN a network error occurs, THEN THE Shelter System SHALL display "Failed to add resident. Please try again."
6. WHERE multiple validation errors exist, THE Shelter System SHALL display all error messages simultaneously

