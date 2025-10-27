# WanderLust - Airbnb Clone

A full-stack Airbnb clone application with a React frontend and Node.js/Express backend.

## 🚀 Features

- User authentication with OTP verification
- Create, read, update, and delete listings
- Search and filter listings by category
- Add and delete reviews with ratings
- User profiles with image upload
- Image upload to Cloudinary
- Responsive design with Tailwind CSS
- RESTful API architecture

## 📁 Project Structure

```
WanderLust/
├── backend/          # Node.js/Express API server
│   ├── controllers/  # Request handlers
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── middleware.js # Authentication & validation
│   └── app.js        # Main server file
├── frontend/         # React application
│   ├── src/
│   │   ├── api/      # API service layer
│   │   ├── components/ # Reusable components
│   │   ├── context/  # React Context (Auth)
│   │   ├── pages/    # Page components
│   │   └── App.jsx   # Main app component
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Backend

- Node.js & Express
- MongoDB & Mongoose
- Passport.js (Authentication)
- Cloudinary (Image storage)
- Nodemailer (Email OTP)
- Joi (Validation)

### Frontend

- React 19
- React Router DOM
- Axios
- Tailwind CSS
- React Icons
- Vite (Build tool)

## 📦 Installation

### Prerequisites

- Node.js (v20+)
- MongoDB
- Cloudinary account
- Email service (for OTP)

### Backend Setup

1. Navigate to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
PORT=8080
```

4. Start the backend server:

```bash
node app.js
```

Backend will run on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🎯 Usage

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Sign up for a new account (OTP will be sent to your email)
4. Browse listings, create new ones, add reviews
5. Manage your profile

## 📝 API Endpoints

### Authentication

- `POST /signup` - Register new user
- `POST /send-otp` - Send OTP to email
- `POST /login` - Login user
- `GET /logout` - Logout user
- `GET /profile` - Get user profile
- `PUT /profile/edit` - Update profile

### Listings

- `GET /listings` - Get all listings
- `GET /listings/:id` - Get single listing
- `POST /listings` - Create new listing (auth required)
- `PUT /listings/:id` - Update listing (auth required)
- `DELETE /listings/:id` - Delete listing (auth required)
- `GET /listings/category/:category` - Filter by category
- `GET /listings/search` - Search listings

### Reviews

- `POST /listings/:listingId/reviews` - Add review (auth required)
- `DELETE /listings/:listingId/reviews/:reviewId` - Delete review (auth required)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Created with ❤️ by Kirti Soni
