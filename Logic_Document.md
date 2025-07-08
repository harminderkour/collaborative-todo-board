# TaskFlow Logic Documentation

## Smart Assignment Algorithm

### Overview
The Smart Assignment feature automatically distributes tasks to team members based on their current workload, ensuring balanced task distribution and optimal team productivity.

### Implementation Logic

#### 1. Active Task Calculation
\`\`\`
For each user in the system:
  - Count all tasks assigned to the user
  - Filter out tasks with status "Done" 
  - Result = Active task count for the user
\`\`\`

#### 2. User Selection Process
\`\`\`
1. Create array of all users with their active task counts
2. Sort users by active task count (ascending order)
3. Select the first user (lowest task count)
4. If multiple users have the same lowest count, select the first one
\`\`\`

#### 3. Assignment Execution
\`\`\`
1. Update the task's assignedTo field with selected user
2. Log the assignment action in activity feed
3. Broadcast the change to all connected clients via WebSocket
4. Update the task's lastModified timestamp
\`\`\`

### Benefits
- **Load Balancing**: Prevents task overload on individual team members
- **Fairness**: Ensures equitable work distribution
- **Efficiency**: Reduces manual assignment overhead
- **Scalability**: Works with any number of team members

### Example Scenario
\`\`\`
Team Members:
- Alice: 3 active tasks
- Bob: 1 active task  
- Charlie: 2 active tasks

When Smart Assign is triggered:
→ Bob is selected (lowest count: 1)
→ Task is assigned to Bob
→ Bob's active task count becomes 2
\`\`\`

## Conflict Handling System

### Overview
The conflict handling system detects and resolves simultaneous edits to the same task by multiple users, maintaining data integrity while providing flexible resolution options.

### Conflict Detection Logic

#### 1. Timestamp-Based Detection
\`\`\`
When a user attempts to save task changes:
1. Check the task's last modification timestamp
2. Compare with current time
3. If modified within last 5 seconds by different user:
   → Conflict detected
4. Check if lastModifiedBy ≠ current user ID
\`\`\`

#### 2. Field-Level Conflict Identification
\`\`\`
Compare incoming changes with current task state:
- Title changes
- Description modifications  
- Status updates
- Priority adjustments
- Assignment changes

Store conflicting fields for resolution interface
\`\`\`

### Resolution Mechanisms

#### 1. Keep Your Version
\`\`\`
Action: Overwrite server data with user's changes
Process:
1. Ignore other user's modifications
2. Apply current user's changes completely
3. Update lastModifiedBy to current user
4. Broadcast updated task to all clients
\`\`\`

#### 2. Accept Their Version
\`\`\`
Action: Discard user's changes, keep server data
Process:
1. Abandon current user's modifications
2. Return existing server task data
3. No database update required
4. User interface reflects server state
\`\`\`

#### 3. Merge Changes
\`\`\`
Action: Manually combine both versions
Process:
1. Present both versions side-by-side
2. Allow field-by-field selection
3. User creates merged version manually
4. Validate merged data integrity
5. Save merged version to database
6. Broadcast final merged task
\`\`\`

### Conflict Resolution Interface

#### User Experience Flow
\`\`\`
1. User attempts to save task
2. Server detects conflict
3. Modal dialog appears showing:
   - Conflict notification
   - Both versions of conflicting fields
   - Three resolution options
4. User selects resolution method
5. If merge selected:
   - Show field-by-field comparison
   - Allow manual input for final values
6. Apply resolution and update all clients
\`\`\`

### Example Conflict Scenario
\`\`\`
Initial Task State:
- Title: "Design Homepage"
- Status: "Todo"
- Priority: "Medium"

User A Changes (at 10:00:00):
- Title: "Design New Homepage"
- Priority: "High"

User B Changes (at 10:00:03):
- Status: "In Progress"
- Priority: "Low"

Conflict Detected:
- Both users modified Priority field
- User A: Medium → High
- User B: Medium → Low

Resolution Options:
1. Keep A's version: Priority = "High", Status = "Todo"
2. Keep B's version: Priority = "Low", Status = "In Progress"  
3. Merge: User decides Priority = "High", Status = "In Progress"
\`\`\`

### Technical Implementation Details

#### Server-Side Validation
\`\`\`javascript
// Conflict detection pseudocode
function detectConflict(taskId, incomingChanges, userId) {
  const currentTask = getTaskById(taskId)
  const timeDiff = Date.now() - new Date(currentTask.updatedAt)
  
  if (timeDiff < 5000 && currentTask.lastModifiedBy !== userId) {
    return {
      conflict: true,
      currentVersion: currentTask,
      incomingVersion: incomingChanges,
      conflictFields: getConflictingFields(currentTask, incomingChanges)
    }
  }
  
  return { conflict: false }
}
\`\`\`

#### Client-Side Resolution
\`\`\`javascript
// Resolution handling pseudocode
function handleConflictResolution(resolution, conflictData) {
  switch(resolution.type) {
    case 'keep_current':
      return conflictData.incomingVersion
    case 'accept_theirs':
      return conflictData.currentVersion
    case 'merge':
      return resolution.mergedData
  }
}
\`\`\`

### Benefits of This Approach
- **Data Integrity**: Prevents data loss from simultaneous edits
- **User Control**: Gives users choice in conflict resolution
- **Transparency**: Shows exactly what conflicts exist
- **Flexibility**: Supports different resolution strategies
- **Real-time**: Immediate conflict detection and resolution

This conflict handling system ensures that collaborative editing remains smooth and data remains consistent across all users while providing the flexibility needed for effective teamwork.
