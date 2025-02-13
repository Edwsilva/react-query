# Codegus React Query

A demo application showcasing React Query capabilities with a simple user management system for my YouTube channel.

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
pnpm i
```

3. Start the development server:

```bash
pnpm dev
```

## API Endpoints

### Add a User

To add a new user via cURL, use the following command:

```bash
curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{"fullName": "John Doe", "email": "john@example.com"}'
```
