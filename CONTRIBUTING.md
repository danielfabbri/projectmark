# Contributing to ProjectMark

Thank you for your interest in contributing to ProjectMark! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Basic knowledge of TypeScript and Express.js

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/projectmark.git
   cd projectmark
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a development environment file:
   ```bash
   cp env.example .env
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Commit Messages

Use conventional commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add JWT token refresh functionality
fix(validation): resolve email validation issue
docs(api): update authentication endpoints documentation
```

### Testing

- Write tests for all new features
- Maintain test coverage above 70%
- Run tests before submitting PR:
  ```bash
  npm test
  npm run test:coverage
  ```

### Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

### Pull Request Guidelines

- Provide a clear description of changes
- Reference any related issues
- Ensure all tests pass
- Update documentation if needed
- Keep PRs focused and reasonably sized

## 🏗️ Architecture Guidelines

### Design Patterns

When adding new features, consider these patterns:

- **Strategy Pattern**: For different algorithms or behaviors
- **Factory Pattern**: For object creation
- **Repository Pattern**: For data access
- **Middleware Pattern**: For request processing

### File Organization

- Controllers: Handle HTTP requests/responses
- Services: Contain business logic
- Models: Define data structures
- Repositories: Handle data persistence
- Middleware: Process requests before controllers
- DTOs: Define data transfer objects
- Errors: Custom error classes

### Error Handling

- Use custom error classes from `src/errors/`
- Provide meaningful error messages
- Include appropriate HTTP status codes
- Log errors appropriately

## 🧪 Testing Guidelines

### Unit Tests

- Test business logic in services
- Mock external dependencies
- Test edge cases and error conditions
- Use descriptive test names

### Integration Tests

- Test complete API endpoints
- Test authentication and authorization
- Test error scenarios
- Use realistic test data

### Test Structure

```typescript
describe('FeatureName', () => {
  describe('methodName', () => {
    it('should do something when condition is met', async () => {
      // Arrange
      const input = 'test data';
      
      // Act
      const result = await service.method(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

## 📚 Documentation

### API Documentation

- Update README.md for new endpoints
- Include request/response examples
- Document authentication requirements
- Explain any new concepts

### Code Documentation

- Add JSDoc comments for public methods
- Explain complex business logic
- Document design decisions in comments

## 🐛 Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, OS)
- Relevant error messages or logs

## 💡 Feature Requests

When suggesting features:

- Describe the use case
- Explain the expected behavior
- Consider implementation complexity
- Check for existing similar requests

## 🔒 Security

- Never commit sensitive information
- Use environment variables for configuration
- Validate all user inputs
- Follow security best practices
- Report security issues privately

## 📞 Getting Help

- Check existing issues and discussions
- Review the documentation
- Ask questions in GitHub discussions
- Join our community (if available)

## 🎯 Areas for Contribution

We welcome contributions in these areas:

- **New Features**: Additional API endpoints, functionality
- **Testing**: Improve test coverage, add new test scenarios
- **Documentation**: Improve README, add examples, tutorials
- **Performance**: Optimize queries, improve response times
- **Security**: Enhance authentication, add security features
- **Developer Experience**: Improve tooling, add development utilities

## 📋 Checklist for Contributors

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] No sensitive information is included
- [ ] Changes are focused and well-described

Thank you for contributing to ProjectMark! 🎉
