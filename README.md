# ProjectMark API

A comprehensive Node.js API for managing topics with versioning, hierarchical relationships, and role-based access control. Built with TypeScript, Express.js, and implementing advanced design patterns including Strategy, Composite, and Factory patterns.

## 🚀 Features

### Core Functionality
- **Topic Management**: Create, update, and version topics with full history tracking
- **Hierarchical Structure**: Parent-child relationships with tree traversal capabilities
- **Resource Management**: Attach and manage resources (links, documents, media) to topics
- **Version Control**: Automatic versioning with complete change history
- **Path Finding**: Shortest path algorithm between topics using BFS

### Authentication & Authorization
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Three-tier permission system (Admin, Editor, Viewer)
- **Strategy Pattern**: Flexible authorization system with extensible roles
- **Permission Matrix**: Granular permissions for different operations

### Technical Features
- **TypeScript**: Full type safety and modern JavaScript features
- **Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Centralized error handling with structured responses
- **Testing**: Complete test suite with Jest and Supertest
- **Logging**: Structured logging with Winston
- **Design Patterns**: Strategy, Composite, Factory, and Repository patterns

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## 🛠️ Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/danielfabbri/projectmark.git
   cd projectmark
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the application**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:3000`

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | No |
| `PORT` | Server port | `3000` | No |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` | Yes |

### Database Setup

The application uses JSON file-based storage for simplicity. Data is automatically created in the `data/` directory:

- `data/topics.json` - Topic storage
- `data/resources.json` - Resource storage  
- `data/users.json` - User storage

No additional database setup is required.

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "viewer"
  }
}
```

#### Get User Permissions
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Get Available Roles
```http
GET /auth/roles
```

### Topic Endpoints

#### Create Topic
```http
POST /topics
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Topic",
  "content": "Topic content here",
  "parentTopicId": "optional-parent-id"
}
```

#### Update Topic (Creates New Version)
```http
PUT /topics/:topicId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Topic Name",
  "content": "Updated content",
  "parentTopicId": "new-parent-id"
}
```

#### Get Latest Topic Version
```http
GET /topics/:topicId
Authorization: Bearer <token>
```

#### Get Specific Topic Version
```http
GET /topics/:topicId/versions/:version
Authorization: Bearer <token>
```

#### Get Topic Tree (Hierarchical Structure)
```http
GET /topics/:topicId/tree
Authorization: Bearer <token>
```

#### Find Shortest Path Between Topics
```http
GET /topics/path?from=:topicId1&to=:topicId2
Authorization: Bearer <token>
```

### Resource Endpoints

#### Create Resource
```http
POST /topics/:topicId/resources
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://example.com",
  "description": "Resource description",
  "type": "link"
}
```

#### Get Topic Resources
```http
GET /topics/:topicId/resources
Authorization: Bearer <token>
```

#### Update Resource
```http
PUT /resources/:resourceId
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://updated-example.com",
  "description": "Updated description"
}
```

#### Delete Resource
```http
DELETE /resources/:resourceId
Authorization: Bearer <token>
```

## 🔐 Authentication

### JWT Token Usage

Include the JWT token in the Authorization header for all protected endpoints:

```http
Authorization: Bearer <your-jwt-token>
```

### Role-Based Permissions

| Permission | Admin | Editor | Viewer |
|------------|-------|--------|--------|
| Create Topics | ✅ | ✅ | ❌ |
| Update Topics | ✅ | ✅ | ❌ |
| Delete Topics | ✅ | ✅ | ❌ |
| View Topics | ✅ | ✅ | ✅ |
| View Topic History | ✅ | ✅ | ✅ |
| Create Resources | ✅ | ✅ | ❌ |
| Update Resources | ✅ | ✅ | ❌ |
| Delete Resources | ✅ | ✅ | ❌ |
| View Resources | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ |
| Admin Panel | ✅ | ❌ | ❌ |

### Error Responses

All endpoints return structured error responses:

```json
{
  "status": 400,
  "message": "Validation failed",
  "details": [
    {
      "property": "name",
      "value": "",
      "constraints": {
        "isNotEmpty": "Name is required"
      }
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/topics"
}
```

## 💡 Usage Examples

### Complete Workflow Example

1. **Login and get token**
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@example.com", "name": "Admin User"}'
   ```

2. **Create a root topic**
   ```bash
   curl -X POST http://localhost:3000/topics \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"name": "Project Documentation", "content": "Main documentation topic"}'
   ```

3. **Create a child topic**
   ```bash
   curl -X POST http://localhost:3000/topics \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"name": "API Documentation", "content": "API docs", "parentTopicId": "<root-topic-id>"}'
   ```

4. **Add a resource to the topic**
   ```bash
   curl -X POST http://localhost:3000/topics/<topic-id>/resources \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://api-docs.example.com", "description": "API documentation", "type": "link"}'
   ```

5. **Get the complete topic tree**
   ```bash
   curl -X GET http://localhost:3000/topics/<root-topic-id>/tree \
     -H "Authorization: Bearer <token>"
   ```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

### Test Coverage

The project maintains a minimum test coverage of 70% across:
- Unit tests for services and controllers
- Integration tests for API endpoints
- Authentication and authorization flows
- Error handling scenarios

### Test Structure

```
src/__tests__/
├── unit/           # Unit tests for business logic
├── integration/    # API integration tests
├── mocks/          # Mock implementations
└── utils/          # Test utilities and helpers
```

## 🏗️ Architecture

### Design Patterns

- **Strategy Pattern**: Role-based authorization system
- **Composite Pattern**: Hierarchical topic structure
- **Factory Pattern**: Object creation and versioning
- **Repository Pattern**: Data access abstraction

### Project Structure

```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic layer
├── models/          # Data models and entities
├── repositories/    # Data access layer
├── routes/          # API route definitions
├── middleware/      # Express middleware
├── auth/           # Authentication and authorization
├── dtos/           # Data transfer objects
├── errors/         # Custom error classes
├── utils/          # Utility functions
└── __tests__/      # Test files
```

### Key Components

- **TopicService**: Core business logic for topic management
- **AuthController**: Authentication and user management
- **AuthorizationMiddleware**: Role-based access control
- **ValidationMiddleware**: Input validation using DTOs
- **ErrorHandler**: Centralized error handling

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-production-secret-key
```

### Docker Support (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Maintain test coverage above 70%
- Use conventional commit messages
- Update documentation for API changes

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the API documentation above
- Review the test files for usage examples

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - Topic management with versioning
  - Role-based authentication
  - Resource management
  - Comprehensive test suite
  - API documentation

---

**ProjectMark API** - A robust, scalable solution for topic management with advanced features and enterprise-grade architecture.
