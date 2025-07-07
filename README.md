# Undercover Loo 🚽

A crowdsourced bathroom-finder web application that helps users discover and share information about public restrooms. Built with Django REST Framework backend and React frontend.

## 🎯 Project Overview

Undercover Loo is designed to make it extremely fast and easy for users to:
- Find nearby public bathrooms
- Submit new bathroom locations with minimal input
- Rate and review bathroom facilities
- Upload photos of bathroom facilities
- View bathrooms on an interactive map

## 🏗️ Architecture

- **Backend**: Django + Django REST Framework
- **Frontend**: React with modern hooks and components
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **Authentication**: Django's built-in user system
- **File Storage**: Local media files (development) / Cloud storage ready

## 📁 Project Structure

```
undercoverLoo/
├── backend/                 # Django REST API
│   ├── api/                # Main API app
│   ├── backend/            # Django project settings
│   ├── media/              # Uploaded images
│   ├── venv/               # Python virtual environment
│   └── manage.py
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   └── ...
│   ├── public/
│   └── package.json
└── static_website/         # Static landing page
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/danielbrianjohnson/undercoverLoo.git
cd undercoverLoo
```

### 2. Backend Setup

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Optional: create admin user
python manage.py runserver 8001
```

The API will be available at `http://localhost:8001/api/`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The React app will be available at `http://localhost:3000`

## 🔧 Development

### Backend Development

- API endpoints are available at `/api/`
- Admin interface at `/admin/`
- See `backend/README.md` for detailed backend documentation

### Frontend Development

- React development server with hot reload
- Components are organized in `src/components/` and `src/pages/`
- See `frontend/README.md` for detailed frontend documentation

## 📊 API Endpoints

### Core Endpoints

- `GET/POST /api/loos/` - List/Create bathrooms
- `GET/PUT/DELETE /api/loos/{id}/` - Retrieve/Update/Delete specific bathroom
- `GET/POST /api/loos/{id}/reviews/` - List/Create reviews for a bathroom
- `POST /api/upload-image/` - Upload bathroom images
- `GET /api/my-loos/` - Get current user's submitted bathrooms

### Authentication

- Uses Django's session authentication
- Token authentication available for API clients
- CORS enabled for frontend development

## 🌟 Features

### Current Features

- ✅ Bathroom location submission with GPS coordinates
- ✅ Rating system (cleanliness, privacy)
- ✅ Photo uploads
- ✅ User reviews and ratings
- ✅ Interactive map view
- ✅ Responsive design
- ✅ Admin interface for content management

### Planned Features

- 🔄 Real-time updates
- 🔄 Advanced search and filtering
- 🔄 User profiles and badges
- 🔄 Mobile app (React Native)
- 🔄 Social features (favorites, sharing)

## 🧪 Testing

### Backend Tests

```bash
cd backend
source venv/bin/activate
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment

1. Set up production database (PostgreSQL recommended)
2. Configure environment variables
3. Set `DEBUG = False` in settings
4. Configure static file serving
5. Set up proper CORS settings

### Frontend Deployment

1. Build the React app: `npm run build`
2. Serve static files or deploy to CDN
3. Update API endpoints for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the backend and frontend README files for detailed setup instructions
2. Look through existing GitHub issues
3. Create a new issue with detailed information about your problem

## 🙏 Acknowledgments

- Built with Django REST Framework and React
- Map functionality powered by modern web APIs
- Icons and design inspired by modern web standards

---

**Happy bathroom hunting! 🚽✨**
