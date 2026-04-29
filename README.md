# Our Space

Private romantic app for Visshwa (`AI`) and Vandna (`The One`).

## Run Locally On Windows

PowerShell may block `npm` because it tries to run `npm.ps1`. Use either:

```bat
npm.cmd run dev
```

or:

```bat
.\run-dev.bat
```

Open:

```text
http://127.0.0.1:5173
```

## Firebase Setup

Fill `.env` with the Firebase web app config:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Then restart the dev server. Vite only reads `.env` when the server starts.

Enable:

- Authentication: Anonymous sign-in
- Cloud Firestore
- Firebase Storage

Deploy or paste the rules from `firestore.rules` and `storage.rules`.

## Private Couple Model

This is intentionally only for two people:

- Visshwa as `AI`
- Vandna as `The One`

On each device, choose whether that device is `AI` or `The One` before creating or joining the private room.
