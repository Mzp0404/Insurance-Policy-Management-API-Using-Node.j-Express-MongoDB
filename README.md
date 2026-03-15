# Insurance Policy Management API

A comprehensive REST API for managing insurance policies with full CRUD operations, built with Node.js, Express, and MongoDB.

## Features

- ✅ Full CRUD operations for insurance policies
- ✅ Input validation and error handling
- ✅ MongoDB with Mongoose ODM
- ✅ Filter policies by type
- ✅ Filter by active status
- ✅ Pagination support
- ✅ Request logging middleware
- ✅ Comprehensive error handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Environment Variables**: dotenv

## Installation

1. Clone the repository or download the project
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Configure your MongoDB URI in the `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/insurance-policy-db
PORT=5000
NODE_ENV=development
```

5. Ensure MongoDB is running on your system

## Running the API

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will start on `http://localhost:5000`

## API Endpoints

### Create a Policy
- **Endpoint**: `POST /policies`
- **Body**:
```json
{
  "policyNumber": "POL123456",
  "policyHolderName": "John Doe",
  "policyType": "Health",
  "premiumAmount": 5000,
  "startDate": "2024-01-01",
  "endDate": "2025-01-01",
  "isActive": true
}
```
- **Response**: `201 Created`

### Get All Policies
- **Endpoint**: `GET /policies`
- **Query Parameters**:
  - `policyType`: Filter by policy type (Health, Life, Vehicle, Home, Travel)
  - `isActive`: Filter by active status (true/false)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Example**: `GET /policies?policyType=Health&isActive=true&page=1&limit=5`
- **Response**: `200 OK`

### Get Policy by ID
- **Endpoint**: `GET /policies/:id`
- **Response**: `200 OK`

### Update Policy by ID
- **Endpoint**: `PUT /policies/:id`
- **Body**: Any of the policy fields to update
- **Response**: `200 OK`

### Delete Policy by ID
- **Endpoint**: `DELETE /policies/:id`
- **Response**: `200 OK`

### Health Check
- **Endpoint**: `GET /health`
- **Response**: `200 OK`

## Policy Model

### Properties
- `policyNumber` (String, required, unique) - Unique policy identifier
- `policyHolderName` (String, required) - Name of the policy holder
- `policyType` (String, required) - Type of policy (Health, Life, Vehicle, Home, Travel)
- `premiumAmount` (Number, required) - Premium amount (must be positive)
- `startDate` (Date, required) - Policy start date
- `endDate` (Date, required) - Policy end date (must be after startDate)
- `isActive` (Boolean, default: true) - Whether the policy is active
- `timestamps` - Automatically added (createdAt, updatedAt)

## Validation

The API includes comprehensive validation for:
- ✅ Required fields
- ✅ Unique policy numbers
- ✅ Positive premium amounts
- ✅ Valid date ranges (endDate > startDate)
- ✅ Policy type enumeration
- ✅ MongoDB ObjectId format for updates/deletes

## Error Handling

All errors are returned with appropriate HTTP status codes:
- `400 Bad Request` - Invalid input or validation error
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate policy number
- `500 Internal Server Error` - Server error

## Example Requests

### Create a Policy
```bash
curl -X POST http://localhost:5000/policies \
  -H "Content-Type: application/json" \
  -d '{
    "policyNumber": "POL001",
    "policyHolderName": "Alice Johnson",
    "policyType": "Health",
    "premiumAmount": 3000,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'
```

### Get All Active Health Policies with Pagination
```bash
curl http://localhost:5000/policies?policyType=Health&isActive=true&page=1&limit=5
```

### Update a Policy
```bash
curl -X PUT http://localhost:5000/policies/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "premiumAmount": 3500,
    "isActive": false
  }'
```

### Delete a Policy
```bash
curl -X DELETE http://localhost:5000/policies/{id}
```

## Project Structure

```
insurance-policy-api/
├── models/
│   └── Policy.js              # Mongoose schema for policies
├── routes/
│   └── policyRoutes.js        # Express routes
├── controllers/
│   └── policyController.js    # Request handlers and business logic
├── middleware/
│   └── requestLogger.js       # Request logging middleware
├── server.js                  # Entry point
├── .env.example              # Environment variables template
├── package.json              # Dependencies
└── README.md                 # Documentation
```

## Development

For development with auto-reload:
```bash
npm run dev
```

This uses nodemon to automatically restart the server when files change.

## Notes

- MongoDB must be running before starting the API
- All timestamps are stored in ISO 8601 format
- Policy types are restricted to: Health, Life, Vehicle, Home, Travel
- Premium amounts must be positive numbers
- All dates should be in a valid date format (ISO 8601 recommended)

## License

ISC
