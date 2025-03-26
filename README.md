

Country Data Dashboard
This project is a web application that allows users to view, search, and filter information about countries around the world. It consists of a Node.js/Express backend and a Next.js/React frontend.
Features


Search countries by name
Filter countries by region
View detailed information about each country
Responsive design that works on desktop and mobile devices
Infinite scroll for smooth browsing experience
Comprehensive test coverage (70%+)


Setup Instructions
Prerequisites

Node.js (v16.0.0 or higher)
npm or yarn

Backend Setup

Navigate to the backend directory:
cd backend

Install dependencies:
npm install

Create a .env file in the backend directory with the following variables:
PORT=3001

Start the development server:
npm run dev

Build for production:
npm run build

Run tests:
npm test


Frontend Setup

Navigate to the frontend directory:
bashCopycd frontend

Install dependencies:
npm install

Create a .env.local file in the frontend directory with the following variables:
CopyNEXT_PUBLIC_API_URL=http://localhost:3001

Start the development server:
npm run dev

Build for production:
npm run build

Run tests:
npm test


API Endpoints

GET /countries: Get paginated list of countries
GET /countries/:code: Get detailed information about a specific country
GET /countries/region/:region: Get countries filtered by region
GET /countries/search: Search countries by name, capital, etc.

Implemented Fixes
Throughout the development process, several key issues were addressed:

Backend Improvements:

Added proper error handling for all API endpoints
Implemented caching to reduce API calls
Fixed inconsistent response structures
Added alphabetical sorting of countries


Frontend Enhancements:

Fixed UI responsiveness across devices
Implemented infinite scrolling for country list
Added combined search and filter functionality
Fixed router path issues
Enhanced user experience with loading states


Testing:

Achieved over 70% test coverage
Implemented comprehensive unit tests for components
Added tests for custom hooks and API services
Included edge case handling in tests



Technologies Used
Backend

Node.js
Express
TypeScript
Axios for API requests

Frontend

React
Next.js
TypeScript
Tailwind CSS
Vitest for testing

Credits
This project was developed as part of an interview assignment for Elanco. The data is sourced from the REST Countries API.
