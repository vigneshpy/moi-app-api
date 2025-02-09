```moi-app-api/
src
│
├── config/                  # Configuration files
│   ├── db.js                # Database connection logic
│   └── config.js            # Configuration variables (e.g., secrets, keys)
│
├── controllers/             # Logic for handling HTTP requests
│   ├── userController.js    # User-related actions (e.g., signup, login)
│   ├── eventController.js   # Event-related actions (e.g., create event, get events)
│   ├── transactionController.js # Transaction-related actions (e.g., process payment)
│   └── accountController.js # Account-related actions (e.g., link UPI, check balance)
│
├── models/                  # Mongoose models (schemas)
│   ├── userModel.js         # User schema and model
│   ├── eventModel.js        # Event schema and model
│   ├── transactionModel.js  # Transaction schema and model
│   └── accountModel.js      # Account schema and model
│
├── routes/                  # API routes
│   ├── userRoutes.js        # User-related routes (e.g., auth, user profile)
│   ├── eventRoutes.js       # Event-related routes (e.g., create event, fetch events)
│   ├── transactionRoutes.js # Transaction routes (e.g., process payment, get transactions)
│   └── accountRoutes.js     # Account routes (e.g., link UPI, view account)
│
├── middleware/              # Custom middleware
│   ├── authMiddleware.js    # Authentication middleware
│   └── errorMiddleware.js   # Global error handler
│
├── services/                # Business logic and helper functions
│   ├── paymentService.js    # Handles payment logic (e.g., UPI integration, cash payments)
│   └── emailService.js      # Handles email-related tasks (e.g., user verification)
│
├── utils/                   # Utility functions and constants
│   ├── generateUPI.js       # Function for generating UPI QR codes
│   └── helpers.js           # Helper functions (e.g., for date formatting)
│
├── views/                   # Templated responses (optional)
│   └── emailTemplates/      # HTML email templates
│
├── .env                     # Environment variables (e.g., DB URL, API keys)
├── index.js                   # Entry point for the Express app
├── package.json             # Dependencies and scripts
```
