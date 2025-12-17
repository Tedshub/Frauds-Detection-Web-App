<p align="center">
  <a href="https://laravel.com" target="_blank">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="300" alt="Laravel Logo">
  </a>
    <a href="https://vitejs.dev" target="_blank">
    <img src="https://vitejs.dev/logo.svg" width="80" alt="Vite Logo">
  </a>
  <a href="https://react.dev" target="_blank">
    <img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png" width="80" alt="React Logo" style="margin: 0 20px;">
  </a>
</p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# Frauds Detection Web App

A modern web application for credit card fraud detection built with Laravel 12, Inertia.js, and React.js. This application provides a comprehensive solution for analyzing and detecting fraudulent credit card transactions using machine learning integration and an intuitive user interface.

## Project Description

Frauds Detection Web App is a full-stack web application designed to help identify potentially fraudulent credit card transactions. Built on Laravel 12 framework with Inertia.js for seamless single-page application experience and React.js for dynamic frontend components, this application combines modern web technologies with fraud detection capabilities.

### Key Features

- Real-time fraud detection analysis
- Interactive dashboard for transaction monitoring
- Manual transaction input with instant fraud prediction
- JSON-based batch transaction processing
- Responsive and modern UI built with React.js and Tailwind CSS
- Server-side rendering with Inertia.js for optimal performance
- RESTful API integration with machine learning model
- Transaction history and analytics
- User-friendly interface with real-time feedback

### Technology Stack

#### Backend
- **Laravel 12**: PHP web application framework
- **Inertia.js**: Modern monolith architecture
- **PHP 8.2+**: Server-side programming language

#### Frontend
- **React.js**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast frontend build tool

#### Additional Tools
- **Composer**: PHP dependency manager
- **NPM**: Node.js package manager
- **MySQL/PostgreSQL**: Database management system

## System Requirements

Before installation, ensure your system meets the following requirements:

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- NPM or Yarn
- MySQL >= 8.0 or PostgreSQL >= 13
- Git

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Tedshub/Frauds-Detection-Web-App.git
cd Frauds-Detection-Web-App
```

### 2. Install PHP Dependencies
```bash
composer install
```

### 3. Install JavaScript Dependencies
```bash
npm install
```

### 4. Environment Configuration

Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Edit the `.env` file and configure your database and application settings:
```env
APP_NAME="Frauds Detection"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost
PYTHON_API_BASE_URL=http://127.0.0.1:5000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=frauds_detection
DB_USERNAME=root
DB_PASSWORD=

# Add your Flask API endpoint
FRAUD_DETECTION_API_URL=http://localhost:5000
```

### 5. Generate Application Key
```bash
php artisan key:generate
```

### 6. Run Database Migrations

Create the database first, then run migrations:
```bash
php artisan migrate
```

If you want to seed sample data:
```bash
php artisan db:seed
```

### 7. Create Storage Symlink
```bash
php artisan storage:link
```

### 8. Build Frontend Assets

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
```

## Running the Application

### Development Mode

You need to run two separate terminals:

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite Development Server:**
```bash
npm run dev
```

Access the application at: `http://localhost:8000`

### Production Mode

Build the frontend assets:
```bash
npm run build
```

Then serve the application using your preferred method (Apache, Nginx, or Laravel Octane).

## Project Structure
```
Frauds-Detection-Web-App/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/      # Application controllers
│   │   ├── Middleware/       # Custom middleware
│   │   └── Requests/         # Form request validation
│   ├── Models/               # Eloquent models
│   └── Services/             # Business logic services
│
├── bootstrap/                # Application bootstrap files
│   └── app.php
│
├── config/                   # Configuration files
│   ├── app.php
│   ├── database.php
│   └── inertia.php
│
├── database/
│   ├── migrations/           # Database migrations
│   ├── seeders/              # Database seeders
│   └── factories/            # Model factories
│
├── public/                   # Public assets
│   ├── build/                # Compiled frontend assets
│   └── index.php             # Application entry point
│
├── resources/
│   ├── js/
│   │   ├── Components/       # React components
│   │   ├── Layouts/          # Layout components
│   │   ├── Pages/            # Inertia pages
│   │   └── app.jsx           # Main JavaScript file
│   ├── css/
│   │   └── app.css           # Main CSS file
│   └── views/
│       └── app.blade.php     # Root Blade template
│
├── routes/
│   ├── web.php               # Web routes
│   ├── api.php               # API routes
│   └── console.php           # Console routes
│
├── storage/
│   ├── app/                  # Application storage
│   ├── framework/            # Framework storage
│   └── logs/                 # Application logs
│
├── tests/                    # Application tests
│   ├── Feature/              # Feature tests
│   └── Unit/                 # Unit tests
│
├── .env.example              # Example environment file
├── artisan                   # Laravel Artisan CLI
├── composer.json             # PHP dependencies
├── package.json              # Node.js dependencies
├── tailwind.config.js        # Tailwind CSS configuration
├── vite.config.js            # Vite configuration
└── README.md                 # Project documentation
```

### Key Directories Explanation

- **app/Http/Controllers**: Contains all controller classes that handle HTTP requests
- **app/Models**: Eloquent ORM models for database interactions
- **resources/js/Pages**: React components that serve as Inertia pages
- **resources/js/Components**: Reusable React components
- **routes/web.php**: Defines all web routes for the application
- **database/migrations**: Database schema definitions

## Usage Guide

### Detecting Fraudulent Transactions

The application provides two methods for fraud detection:

#### 1. Manual Input

1. Navigate to the fraud detection page
2. Fill in the transaction details form:
   - Credit card number
   - Transaction amount
   - Transaction category
   - Customer information (gender, age, location)
   - Merchant information (location coordinates)
   - Transaction time details
3. Click "Analyze Transaction"
4. View the fraud prediction result

#### 2. JSON Input

Use the JSON input feature to test with pre-formatted data:

**Sample Test Data 1:**
```json
{
  "input": {
    "cc_num": 3591919803438423.0,
    "category": 9.0,
    "amt": 1250.99,
    "gender": 1.0,
    "city": 803.0,
    "state": 9.0,
    "zip": 32780.0,
    "lat": 28.5697,
    "long": -80.8191,
    "city_pop": 54767.0,
    "merch_lat": 35.812398,
    "merch_long": -85.883061,
    "hour": 23.0,
    "dayofweek": 0.0,
    "month": 12.0,
    "age": 38.0
  }
}
```

**Sample Test Data 2:**
```json
{
  "input": {
    "cc_num": 3573030041201292.0,
    "category": 5.0,
    "amt": 850.5,
    "gender": 0.0,
    "city": 16.0,
    "state": 44.0,
    "zip": 84002.0,
    "lat": 40.3207,
    "long": -110.436,
    "city_pop": 302.0,
    "merch_lat": 39.450498,
    "merch_long": -109.960431,
    "hour": 3.0,
    "dayofweek": 2.0,
    "month": 6.0,
    "age": 35.0
  }
}
```

### Input Parameters

- **cc_num**: Credit card number (16 digits)
- **category**: Transaction category code (0-9)
- **amt**: Transaction amount in currency
- **gender**: Customer gender (0 = Female, 1 = Male)
- **city**: City code identifier
- **state**: State code identifier
- **zip**: ZIP/Postal code
- **lat**: Customer latitude coordinate
- **long**: Customer longitude coordinate
- **city_pop**: City population
- **merch_lat**: Merchant latitude coordinate
- **merch_long**: Merchant longitude coordinate
- **hour**: Hour of transaction (0-23)
- **dayofweek**: Day of week (0 = Monday, 6 = Sunday)
- **month**: Month of transaction (1-12)
- **age**: Customer age in years

## API Integration

This application integrates with a Flask-based machine learning API for fraud detection. Ensure the Flask API is running before testing fraud detection features.

### Configure API Endpoint

In your `.env` file:
```env
FRAUD_DETECTION_API_URL=http://localhost:5000
```

### API Communication

The Laravel backend communicates with the Flask API using HTTP requests. The fraud detection controller sends transaction data and receives predictions.

## Development

### Running Tests
```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter TestName

# Run with coverage
php artisan test --coverage
```

### Code Style

This project follows PSR-12 coding standards. Format your code using:
```bash
# For PHP
./vendor/bin/pint

# For JavaScript/React
npm run lint
```

### Adding New Features

1. Create necessary routes in `routes/web.php`
2. Create controller in `app/Http/Controllers`
3. Create React page component in `resources/js/Pages`
4. Run migrations if database changes are needed
5. Test your feature thoroughly

## Troubleshooting

### Common Issues

#### Port Already in Use
If port 8000 is already in use:
```bash
php artisan serve --port=8001
```

#### Permission Denied on Storage
```bash
chmod -R 775 storage bootstrap/cache
```

#### Vite Connection Refused
Ensure Vite dev server is running:
```bash
npm run dev
```

#### Database Connection Error
- Check database credentials in `.env`
- Ensure database server is running
- Verify database exists

#### Missing Dependencies
```bash
composer install
npm install
```

#### Inertia Version Mismatch
Clear cache and rebuild:
```bash
php artisan cache:clear
php artisan config:clear
npm run build
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## Developer

Developed by [Tedshub](https://github.com/Tedshub)

## License

This project is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Acknowledgments

- Laravel Framework - [https://laravel.com](https://laravel.com)
- Inertia.js - [https://inertiajs.com](https://inertiajs.com)
- React.js - [https://reactjs.org](https://reactjs.org)
- Tailwind CSS - [https://tailwindcss.com](https://tailwindcss.com)

## Security

If you discover any security vulnerabilities, please email the developer directly instead of using the issue tracker. All security vulnerabilities will be promptly addressed.

## Support

For questions, issues, or feature requests:
- Open an issue on [GitHub](https://github.com/Tedshub/Frauds-Detection-Web-App/issues)
- Contact the developer through [GitHub profile](https://github.com/Tedshub)

## Roadmap

Future enhancements planned:
- Advanced analytics dashboard
- Transaction history visualization
- Real-time fraud alerts
- Multi-language support
- API rate limiting and authentication
- Export reports functionality
- Machine learning model versioning

## Changelog

### Version 1.0.0
- Initial release
- Basic fraud detection functionality
- Manual and JSON input methods
- Integration with Flask ML API
- Responsive UI with React and Tailwind CSS
