# 🌿 Herbal Health

## Description
Herbal Health is a full-stack online shopping web application. Users can select their health condition to discover suitable fruits and herbs, browse products, add them to their cart, and complete purchases.

## Features
- **Smart Filtering:** Find fruits and herbs based on specific health conditions.
- **Shopping Cart:** Add, remove, and manage items easily.
- **Cloud Database:** Real-time data storage using MongoDB Atlas.
- **Responsive Design:** Optimized for both desktop and mobile users.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas

## Environment Variables
Create a `.env` file in the root directory and add your credentials:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```
## How to Run the Project
1. Clone the repository:
```git clone [https://github.com/faridahossam55/HerbalHealth.git](https://github.com/faridahossam55/HerbalHealth.git)```

2. Install dependencies:
```npm install```

3. Database Setup: Create a .env file in the root and add your MongoDB Atlas connection string.

4. Run the server:
```npm run dev```

5. Open the App: Navigate to http://localhost:5000 in your web browser.

## Notes
MongoDB Atlas is used as a cloud database for scalability.
Sensitive files like .env and node_modules are not pushed to GitHub to follow security best practices.
--- 