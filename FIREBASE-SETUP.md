# Firebase Setup Instructions

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Sign in with tokakhozre@gmail.com (password: Aiagent19!)
3. Click "Create a project" or "Add project"
4. Project name: `fluentge`
5. Enable Google Analytics (recommended)
6. Choose "Default Account for Firebase"

## 2. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click and toggle Enable
   - **Google**: Click, toggle Enable, and add support email: tokakhozre@gmail.com

## 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (we'll configure rules later)
4. Choose location: **europe-west1** (closest to Georgia)

## 4. Configure Firestore Security Rules

Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own card progress
    match /users/{userId}/cardProgress/{cardId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own deck progress
    match /users/{userId}/deckProgress/{deckId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 5. Get Configuration Keys

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" and click **Web app** (</> icon)
3. Register app name: `FluentGe Flashcards`
4. Copy the `firebaseConfig` object

## 6. Update Firebase Configuration

Replace the placeholder values in `/src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "fluentge.firebaseapp.com",
  projectId: "fluentge", 
  storageBucket: "fluentge.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 7. Test Connection

After configuration, the app should connect to Firebase automatically. Check the browser console for any Firebase connection errors.

## 8. Optional: Add Test Data

In Firestore Console, you can manually add test documents to verify everything works:

- Collection: `users`
- Document ID: `test-user`  
- Fields: `{ displayName: "Test User", email: "test@example.com" }`

## Firestore Data Structure

The app will create the following collections:

### /users/{userId}
```javascript
{
  uid: string,
  email: string, 
  displayName: string,
  photoURL?: string,
  createdAt: timestamp,
  isPremium: boolean,
  dailyGoal: number, // minutes per day
  streak: number,
  totalXP: number,
  level: number
}
```

### /users/{userId}/cardProgress/{cardId}
```javascript
{
  cardId: string,
  deckId: string,
  state: "new" | "learning" | "review" | "mastered",
  ease: number, // SM-2 ease factor
  interval: number, // days until next review
  nextReview: timestamp,
  reviewCount: number,
  lastReviewed: timestamp,
  createdAt: timestamp
}
```

### /users/{userId}/deckProgress/{deckId}
```javascript
{
  deckId: string,
  addedAt: timestamp,
  totalCards: number,
  newCards: number,
  learningCards: number,
  reviewCards: number,
  masteredCards: number,
  lastStudied: timestamp
}
```

That's it! The Firebase project should be ready for FluentGe V2.