# Home Call Jobs

This project contains the frontend for the public recruitment portal, employee portal UI, and admin dashboard.

## Security notes

- Never store passwords in Firestore or frontend code. Employee credentials are managed by Firebase Authentication.
- Employee profiles are linked to Firebase Auth accounts by UID; Firestore rules restrict employee data to its owner.
- Copy [.env.example](.env.example) to [.env.local](.env.local) and use only safe placeholder values.

## Local development

1. Install dependencies:
   npm install
2. Create a local environment file from [.env.example](.env.example):
   cp .env.example .env.local
3. Start the app:
   npm run dev
