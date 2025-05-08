# Game Content Manager

A web application for managing game content, including characters, users, and audit logs.

## High-Level Architecture

### Frontend (Angular)
- **Components**
  - Login
  - Character Management
    - Character List
    - Character Detail
    - Character Form
  - User Management
    - User List
    - User Form
    - Change Password
  - Audit Logs
    - Audit Log List
    - Audit Log Detail
  - Token Expiry Warning
- **Services**
  - Auth Service (JWT token management)
    - Login/Logout
    - Token refresh
    - Role checking
  - Character Service
    - CRUD operations
    - Search functionality
  - User Service
    - User management
  - Audit Log Service
    - All Log retrieval
- **Features**
  - JWT-based authentication
  - Role-based access control
  - Token expiry warning (1 minute before expiry)
  - Real-time audit logging
  - Password change enforcement
  - Responsive design

### Backend (.NET Core)
- **Controllers**
  - AuthController
    - Login
    - Refresh token
    - Change password
  - CharacterController
    - CRUD operations
    - Search
  - UserController
    - User management
    - Role management
  - AuditLogController
    - Log retrieval
    - Filtering
- **Services**
  - AuthService
    - JWT token generation
    - Password hashing
    - Role verification
  - CharacterService
    - Character operations
    - Audit logging
  - UserService
    - User operations
    - Password management
  - AuditLogService
    - Log creation
    - Log retrieval
- **Models**
  - User
  - GameCharacter
  - AuditLog

### Database (MongoDB)
- Collections:
  - Users
  - Characters
  - AuditLogs

## Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "email": "string",
  "password": "string",
  "roles": ["string"],
  "mustChangePassword": "boolean",
  "createdAt": "datetime",
  "createdBy": "string",
  "updatedAt": "datetime",
  "updatedBy": "string"
}
```

### Characters Collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "rarity": "string", // Common, Rare, Epic
  "upgradeLevel": "number", // 1-5
  "sortOrder": "number",
  "imageUrl": "string",
  "createdAt": "datetime",
  "createdBy": "string",
  "updatedAt": "datetime",
  "updatedBy": "string"
}
```

### AuditLogs Collection
```json
{
  "_id": "ObjectId",
  "username": "string",
  "action": "string", // Create, Update, Delete
  "entityType": "string", // User, Character
  "entityId": "string",
  "oldValue": "string", // JSON string of old state
  "newValue": "string", // JSON string of new state
  "timestamp": "datetime",
  "deails": "string"
}
```

## API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response:
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "roles": ["string"],
    "mustChangePassword": "boolean"
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Authorization: Bearer {token}

Response:
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "roles": ["string"],
    "mustChangePassword": "boolean"
  }
}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "string",
  "newPassword": "string"
}

Response: 200 OK
```

### Characters

#### Get All Characters
```http
GET /api/characters
Authorization: Bearer {token}


Response: GameCharacter[]
```

#### Get Character by ID
```http
GET /api/characters/{id}
Authorization: Bearer {token}

Response: GameCharacter
```

#### Create Character
```http
POST /api/characters
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "rarity": "string",
  "upgradeLevel": "number",
  "sortOrder": "number",
  "imageUrl": "string"
}

Response: GameCharacter
```

#### Update Character
```http
PUT /api/characters/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "rarity": "string",
  "upgradeLevel": "number",
  "sortOrder": "number",
  "imageUrl": "string"
}

Response: GameCharacter
```

#### Delete Character
```http
DELETE /api/characters/{id}
Authorization: Bearer {token}

Response: 204 No Content
```

### Users

#### Get All Users
```http
GET /api/users
Authorization: Bearer {token}

Response: User[]
```

#### Get User by ID
```http
GET /api/users/{id}
Authorization: Bearer {token}

Response: User
```

#### Create User
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "string",
  "password": "string",
  "roles": ["string"]
}

Response: User
```

#### Update User
```http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "string",
  "roles": ["string"]
}

Response: User
```

#### Delete User
```http
DELETE /api/users/{id}
Authorization: Bearer {token}

Response: 204 No Content
```

### Audit Logs

#### Get Audit Logs
```http
GET /api/audit-logs
Authorization: Bearer {token}
Query Parameters:
  - startDate: datetime
  - endDate: datetime
  - userId: string
  - entityType: string
  - action: string
  - sortBy: string (timestamp)
  - sortOrder: string (asc, desc)

Response: AuditLog[]
```

## Security

### Authentication
- JWT-based authentication
- Token expiry: 5 minutes
- Token refresh available
- Password change enforcement for new users
- Session timeout warning (1 minute before expiry)

### Authorization
- Role-based access control
- Roles:
  - Admin: Full access to all features
  - Writer: Can create/update characters
  - Reader: Can view characters only
- Role-based UI elements visibility
- Protected API endpoints

### Audit Logging
- All CRUD operations are logged
- Logs include:
  - User who performed the action
  - Action type (Create, Update, Delete)
  - Entity type and ID
  - Old and new values (JSON format)
  - Timestamp
  - Details
- Admin-only access to audit logs

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd GameContentManager.API
   dotnet restore
   
   # Frontend
   cd game-content-manager
   npm install
   ```
3. Configure MongoDB connection in `appsettings.json`
4. Configure JWT settings in `appsettings.json`:
   ```json
   {
     "Jwt": {
       "Key": "your-secret-key",
       "Issuer": "your-issuer",
       "Audience": "your-audience"
     }
   }
   ```
5. Run the application:
   ```bash
   # Backend
   dotnet run
   
   # Frontend
   ng serve
   ```

## Environment Variables

### Backend
- `MongoDB:ConnectionString`: MongoDB connection string
- `Jwt:Key`: JWT signing key (min 32 characters)
- `Jwt:Issuer`: JWT issuer
- `Jwt:Audience`: JWT audience
- `Jwt:ExpiryMinutes`: Token expiry time (default: 30)

### Frontend
- `API_URL`: Backend API URL (default: http://localhost:5120)
- `TOKEN_EXPIRY_WARNING_MINUTES`: Minutes before token expiry to show warning (default: 1) 