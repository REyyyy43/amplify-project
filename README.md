# Building Management System

## Overview
A comprehensive building management system built with React, TypeScript, and AWS Amplify. This application allows property managers to handle buildings, units, tasks, and user management through a unified dashboard interface.

## Tech Stack
- **Frontend**: React + TypeScript
- **Backend**: AWS Amplify
- **Database**: AWS DynamoDB
- **Authentication**: AWS Cognito
- **API**: GraphQL

## Architecture

### Frontend-Backend Connection
The application uses AWS Amplify for seamless frontend-backend integration:

typescript
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';
const client = generateClient<Schema>();


### Data Models
The system uses four main data models:

1. **Users**

typescript
interface User {
id: string;
name: string;
email: string;
phone: string;
role: 'tenant' | 'taxi' | 'maintenance' | 'security';
}

2. **Buildings**

typescript
interface Building {
id?: string;
buildingName: string;
address: string;
towerCount: string;
floorsPerTower: string;
unitPerFloors: string;
}

3. **Units**

typescript
interface Unit {
id?: string;
unitName: string;
floor: string;
status: string;
buildingId: string;
}

4. **Tasks**

typescript
interface Task {
id?: string;
taskName: string;
assignedTo: string;
deadline: string;
priority: string;
status: string;
}

## Database Integration

### Data Storage Pattern
The application uses a string concatenation pattern for storing data in DynamoDB. Each record is stored as a pipe-separated string:

typescript
// Example for User data storage
const content = ${name}|${email}|${phone}|${role};
await client.models.User.create({ content });

### Real-time Data Updates
The application implements real-time updates using Amplify's observeQuery:

typescript
useEffect(() => {
const subscription = client.models.User.observeQuery().subscribe({
next: (data) => {
// Transform and update state
},
});
return () => subscription.unsubscribe();
}, []);

## Key Features

### 1. User Management
- Add/Edit/Delete users
- Role-based user categorization
- Real-time user list updates

### 2. Building Management
- Add new buildings
- Track building details
- View building list

### 3. Unit Management
- Track unit status
- Associate units with buildings
- Monitor occupancy

### 4. Task Management
- Create and assign tasks
- Set priorities and deadlines
- Track task status

## Data Flow Example

Here's how data flows when adding a new building:

1. **User Input**

typescript
const buildingData = {
buildingName: 'Tower A',
address: '123 Main St',
towerCount: '2',
floorsPerTower: '10',
unitPerFloors: '4'
};

2. **Data Processing**

typescript
const content = ${buildingData.buildingName}|${buildingData.address}|${buildingData.towerCount}|${buildingData.floorsPerTower}|${buildingData.unitPerFloors};

3. **Database Storage**

typescript
await client.models.Building.create({ content });

4. **Real-time Update**

typescript
useEffect(() => {
const subscription = client.models.Building.observeQuery().subscribe({
next: (data) => {
const mappedBuildings = data.items.map(item => {
const [buildingName, address, towerCount, floorsPerTower, unitPerFloors] =
item.content!.split('|');
return { id: item.id, buildingName, address, towerCount,
floorsPerTower, unitPerFloors };
});
setBuildings(mappedBuildings);
},
});
return () => subscription.unsubscribe();
}, []);

## Security
- AWS Cognito handles user authentication
- Protected routes ensure authorized access
- Role-based access control

## Dashboard Features
- Overview statistics
- User management interface
- Building and unit tracking
- Task management system
- Navigation sidebar
- Search functionality

This application demonstrates a modern approach to building management systems, leveraging AWS services for robust backend functionality while maintaining a clean and intuitive frontend interface.