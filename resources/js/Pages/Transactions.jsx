// resources/js/Transactions.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from "../Layouts/Sidebar";
import NavbarIn from "../Layouts/NavbarIn";
import { usePage } from '@inertiajs/react';
import {
    MapPin,
    CreditCard,
    Calendar,
    Clock,
    User,
    AlertTriangle,
    CheckCircle,
    FileText,
    ChevronDown,
    Loader
} from 'lucide-react';

export default function Transactions() {
    const { categories, genders, states, cities, daysOfWeek, months, hours, apiBaseUrl } = usePage().props;

    // State for form data
    const [formData, setFormData] = useState({
        cc_num: '',
        category: '',
        amt: '',
        gender: '',
        city: '',
        state: '',
        zip: '',
        lat: '',
        long: '',
        city_pop: '',
        merch_lat: '',
        merch_long: '',
        hour: '',
        dayofweek: '',
        month: '',
        age: ''
    });

    // State for UI
    const [activeTab, setActiveTab] = useState('manual');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [distance, setDistance] = useState('0.00 km');
    const [cityData, setCityData] = useState(null);
    const [jsonInput, setJsonInput] = useState('');
    const [map, setMap] = useState(null);
    const [userMarker, setUserMarker] = useState(null);
    const [merchantMarker, setMerchantMarker] = useState(null);
    const [error, setError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false); // New state for save success notification

    // Refs
    const mapRef = useRef(null);
    const resultsRef = useRef(null); // Ref for the results section

    // Helper function to get CSRF token
    const getCsrfToken = () => {
        const token = document.head.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    };

    // Initialize map when component mounts
    useEffect(() => {
        if (typeof window !== 'undefined' && activeTab === 'manual') {
            // Only load Leaflet on client side
            import('leaflet').then((L) => {
                // Fix for default marker icon
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                });

                // Initialize map
                const mapInstance = L.map(mapRef.current).setView([35.2271, -80.8431], 9);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(mapInstance);

                // Create custom icons
                const userIcon = L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                const merchantIcon = L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                // Add markers
                const userMarkerInstance = L.marker([35.2271, -80.8431], {
                    icon: userIcon,
                    draggable: true
                }).addTo(mapInstance)
                .bindPopup('Your location (drag to change)').openPopup();

                const merchantMarkerInstance = L.marker([35.2300, -80.8600], {
                    icon: merchantIcon,
                    draggable: true
                }).addTo(mapInstance)
                .bindPopup('Merchant location (drag to change)');

                // Update coordinates when markers are dragged
                const updateCoordinates = () => {
                    const userLatLng = userMarkerInstance.getLatLng();
                    const merchantLatLng = merchantMarkerInstance.getLatLng();

                    setFormData(prev => ({
                        ...prev,
                        lat: userLatLng.lat.toFixed(6),
                        long: userLatLng.lng.toFixed(6),
                        merch_lat: merchantLatLng.lat.toFixed(6),
                        merch_long: merchantLatLng.lng.toFixed(6)
                    }));

                    // Calculate distance
                    const dist = calculateDistance(
                        userLatLng.lat,
                        userLatLng.lng,
                        merchantLatLng.lat,
                        merchantLatLng.lng
                    );
                    setDistance(`${dist.toFixed(2)} km`);
                };

                userMarkerInstance.on('dragend', updateCoordinates);
                merchantMarkerInstance.on('dragend', updateCoordinates);

                // Initial update
                updateCoordinates();

                // Set state
                setMap(mapInstance);
                setUserMarker(userMarkerInstance);
                setMerchantMarker(merchantMarkerInstance);

                // Set initial coordinates
                setFormData(prev => ({
                    ...prev,
                    lat: '35.227100',
                    long: '-80.843100',
                    merch_lat: '35.230000',
                    merch_long: '-80.860000'
                }));
            });
        }
    }, [activeTab]);

    // Update map when city changes
    useEffect(() => {
        if (cityData && map && userMarker) {
            map.setView([cityData.lat, cityData.long], 10);
            userMarker.setLatLng([cityData.lat, cityData.long]);

            setFormData(prev => ({
                ...prev,
                lat: cityData.lat.toFixed(6),
                long: cityData.long.toFixed(6)
            }));

            // Update distance
            const merchantLat = parseFloat(formData.merch_lat);
            const merchantLng = parseFloat(formData.merch_long);
            if (merchantLat && merchantLng) {
                const dist = calculateDistance(
                    cityData.lat,
                    cityData.long,
                    merchantLat,
                    merchantLng
                );
                setDistance(`${dist.toFixed(2)} km`);
            }
        }
    }, [cityData, map, userMarker, formData.merch_lat, formData.merch_long]);

    // Scroll to results when result is available
    useEffect(() => {
        if (result && resultsRef.current) {
            // Add a small delay to ensure the DOM has updated
            setTimeout(() => {
                resultsRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }, [result]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear any previous errors when user changes input
        if (error) setError(null);
        // Clear save success notification when user changes input
        if (saveSuccess) setSaveSuccess(false);
    };

    // Handle city change
    const handleCityChange = async (e) => {
        const cityName = e.target.options[e.target.selectedIndex].text;
        const cityValue = e.target.value;

        setFormData(prev => ({
            ...prev,
            city: cityValue
        }));

        if (cityName && cityName !== "Select City...") {
            try {
                const response = await fetch(`${apiBaseUrl}/get_city_data/${encodeURIComponent(cityName)}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setCityData(data);

                setFormData(prev => ({
                    ...prev,
                    zip: data.zip.toString(),
                    city_pop: data.population.toString()
                }));
            } catch (error) {
                console.error('Error fetching city data:', error);
                setError(`Failed to fetch city data: ${error.message}`);
                setCityData(null);
                setFormData(prev => ({
                    ...prev,
                    zip: '',
                    city_pop: ''
                }));
            }
        } else {
            setCityData(null);
            setFormData(prev => ({
                ...prev,
                zip: '',
                city_pop: ''
            }));
        }
    };

    // Calculate distance between two points
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            0.5 - Math.cos(dLat)/2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            (1 - Math.cos(dLon))/2;
        return R * 2 * Math.asin(Math.sqrt(a));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        setSaveSuccess(false);

        try {
            // Convert all string values to appropriate types
            const processedData = {
                cc_num: parseFloat(formData.cc_num),
                category: parseFloat(formData.category),
                amt: parseFloat(formData.amt),
                gender: parseFloat(formData.gender),
                city: parseFloat(formData.city),
                state: parseFloat(formData.state),
                zip: parseFloat(formData.zip),
                lat: parseFloat(formData.lat),
                long: parseFloat(formData.long),
                city_pop: parseFloat(formData.city_pop),
                merch_lat: parseFloat(formData.merch_lat),
                merch_long: parseFloat(formData.merch_long),
                hour: parseFloat(formData.hour),
                dayofweek: parseFloat(formData.dayofweek),
                month: parseFloat(formData.month),
                age: parseFloat(formData.age)
            };

            // Use Laravel endpoint instead of direct Python API
            const response = await fetch('/transactions/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                },
                body: JSON.stringify(processedData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setResult(data);

            // Show save success notification if fraud was detected
            if (data.is_fraud) {
                setSaveSuccess(true);
            }
        } catch (error) {
            console.error('Error making prediction:', error);
            setError(`Prediction failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Handle JSON form submission
    const handleJsonSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        setSaveSuccess(false);

        try {
            const jsonData = JSON.parse(jsonInput);

            // If JSON has input property, use that
            const inputData = jsonData.input || jsonData;

            // Use Laravel endpoint instead of direct Python API
            const response = await fetch('/transactions/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                },
                body: JSON.stringify(inputData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setResult(data);

            // Populate form with JSON data
            setFormData({
                cc_num: inputData.cc_num?.toString() || '',
                category: inputData.category?.toString() || '',
                amt: inputData.amt?.toString() || '',
                gender: inputData.gender?.toString() || '',
                city: inputData.city?.toString() || '',
                state: inputData.state?.toString() || '',
                zip: inputData.zip?.toString() || '',
                lat: inputData.lat?.toString() || '',
                long: inputData.long?.toString() || '',
                city_pop: inputData.city_pop?.toString() || '',
                merch_lat: inputData.merch_lat?.toString() || '',
                merch_long: inputData.merch_long?.toString() || '',
                hour: inputData.hour?.toString() || '',
                dayofweek: inputData.dayofweek?.toString() || '',
                month: inputData.month?.toString() || '',
                age: inputData.age?.toString() || ''
            });

            // Switch to manual tab
            setActiveTab('manual');

            // Update map if coordinates are available
            if (inputData.lat && inputData.long && map && userMarker) {
                userMarker.setLatLng([parseFloat(inputData.lat), parseFloat(inputData.long)]);
            }

            if (inputData.merch_lat && inputData.merch_long && map && merchantMarker) {
                merchantMarker.setLatLng([parseFloat(inputData.merch_lat), parseFloat(inputData.merch_long)]);
            }

            // Update distance
            if (inputData.lat && inputData.long && inputData.merch_lat && inputData.merch_long) {
                const dist = calculateDistance(
                    parseFloat(inputData.lat),
                    parseFloat(inputData.long),
                    parseFloat(inputData.merch_lat),
                    parseFloat(inputData.merch_long)
                );
                setDistance(`${dist.toFixed(2)} km`);
            }

            // Update city data if city is available
            if (inputData.city) {
                const cityEntry = Object.entries(cities).find(([name, data]) => data.encoded === parseFloat(inputData.city));
                if (cityEntry) {
                    setCityData(cityEntry[1]);
                }
            }

            // Show save success notification if fraud was detected
            if (data.is_fraud) {
                setSaveSuccess(true);
            }
        } catch (error) {
            console.error('Error processing JSON:', error);
            setError(`JSON processing failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Get option label from value
    const getOptionLabel = (options, value) => {
        const entry = Object.entries(options).find(([key, val]) => val === parseFloat(value));
        return entry ? entry[0] : '';
    };

    return (
        <>
            <Head title="Fraud Detection" />
            <div className="min-h-screen h-screen flex flex-col bg-gray-50 text-gray-900">
                {/* Navbar at top, spanning full width */}
                <NavbarIn />

                <div className="flex flex-1 min-h-0 overflow-hidden">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto p-4 min-w-0 bg-[#1a1c24] text-white">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">Fraud Detection Application</h1>
                            <p className="text-purple-200">Analyze transactions for potential fraud using machine learning</p>
                        </div>

                        {/* Tab Navigation */}
                        <div className="mb-6 border-b border-gray-700">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('manual')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'manual'
                                            ? 'border-purple-500 text-purple-300'
                                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                    }`}
                                >
                                    Manual Input
                                </button>
                                <button
                                    onClick={() => setActiveTab('json')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'json'
                                            ? 'border-purple-500 text-purple-300'
                                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                    }`}
                                >
                                    JSON Input
                                </button>
                                <button
                                    onClick={() => setActiveTab('api')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'api'
                                            ? 'border-purple-500 text-purple-300'
                                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                                    }`}
                                >
                                    API Documentation
                                </button>
                            </nav>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="text-red-400" size={24} />
                                    <span className="text-red-400 font-medium">Error</span>
                                </div>
                                <p className="mt-2 text-red-300">{error}</p>
                            </div>
                        )}

                        {/* Success Display for Fraud Save */}
                        {saveSuccess && (
                            <div className="mb-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-green-400" size={24} />
                                    <span className="text-green-400 font-medium">Success</span>
                                </div>
                                <p className="mt-2 text-green-300">Fraud data has been successfully saved to the database.</p>
                            </div>
                        )}

                        {/* Manual Input Tab */}
                        {activeTab === 'manual' && (
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                    {/* Left Column: Transaction Details */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <CreditCard size={20} />
                                            Transaction Details
                                        </h3>

                                        <div>
                                            <label htmlFor="cc_num" className="block text-sm font-medium text-gray-300 mb-1">
                                                Credit Card Number
                                            </label>
                                            <input
                                                type="number"
                                                id="cc_num"
                                                name="cc_num"
                                                value={formData.cc_num}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="amt" className="block text-sm font-medium text-gray-300 mb-1">
                                                Amount ($)
                                            </label>
                                            <input
                                                type="number"
                                                id="amt"
                                                name="amt"
                                                value={formData.amt}
                                                onChange={handleInputChange}
                                                step="0.01"
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="zip" className="block text-sm font-medium text-gray-300 mb-1">
                                                ZIP Code
                                            </label>
                                            <input
                                                type="number"
                                                id="zip"
                                                name="zip"
                                                value={formData.zip}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">
                                                Age
                                            </label>
                                            <input
                                                type="number"
                                                id="age"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="hour" className="block text-sm font-medium text-gray-300 mb-1">
                                                    Transaction Hour
                                                </label>
                                                <select
                                                    id="hour"
                                                    name="hour"
                                                    value={formData.hour}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                                    required
                                                >
                                                    <option value="" disabled>Select Hour...</option>
                                                    {Object.entries(hours).map(([key, value]) => (
                                                        <option key={key} value={value}>{key}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="dayofweek" className="block text-sm font-medium text-gray-300 mb-1">
                                                    Day of Week
                                                </label>
                                                <select
                                                    id="dayofweek"
                                                    name="dayofweek"
                                                    value={formData.dayofweek}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                                    required
                                                >
                                                    <option value="" disabled>Select Day...</option>
                                                    {Object.entries(daysOfWeek).map(([key, value]) => (
                                                        <option key={key} value={value}>{key}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="month" className="block text-sm font-medium text-gray-300 mb-1">
                                                Month
                                            </label>
                                            <select
                                                id="month"
                                                name="month"
                                                value={formData.month}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                                required
                                            >
                                                <option value="" disabled>Select Month...</option>
                                                {Object.entries(months).map(([key, value]) => (
                                                    <option key={key} value={value}>{key}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <h3 className="text-lg font-semibold flex items-center gap-2 mt-6">
                                            <MapPin size={20} />
                                            Location (Select on Map)
                                        </h3>

                                        <div>
                                            <label htmlFor="distance_km" className="block text-sm font-medium text-gray-300 mb-1">
                                                Distance (km) - <span className="text-gray-400">Calculated Automatically</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="distance_km"
                                                name="distance_km"
                                                value={distance}
                                                readOnly
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-400"
                                            />
                                        </div>

                                        <input type="hidden" id="lat" name="lat" value={formData.lat} />
                                        <input type="hidden" id="long" name="long" value={formData.long} />
                                        <input type="hidden" id="merch_lat" name="merch_lat" value={formData.merch_lat} />
                                        <input type="hidden" id="merch_long" name="merch_long" value={formData.merch_long} />
                                    </div>

                                    {/* Right Column: Categories */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <FileText size={20} />
                                            Categories
                                        </h3>

                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                                                Transaction Category
                                            </label>
                                            <select
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                                required
                                            >
                                                <option value="" disabled>Select Category...</option>
                                                {Object.entries(categories).map(([key, value]) => (
                                                    <option key={key} value={value}>{key}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">
                                                Gender
                                            </label>
                                            <select
                                                id="gender"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                                required
                                            >
                                                <option value="" disabled>Select Gender...</option>
                                                {Object.entries(genders).map(([key, value]) => (
                                                    <option key={key} value={value}>{key}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">
                                                State
                                            </label>
                                            <select
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                                required
                                            >
                                                <option value="" disabled>Select State...</option>
                                                {Object.entries(states).map(([key, value]) => (
                                                    <option key={key} value={value}>{key}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                                                City
                                            </label>
                                            <select
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleCityChange}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                                required
                                            >
                                                <option value="" disabled>Select City...</option>
                                                {Object.entries(cities).map(([key, value]) => (
                                                    <option key={key} value={value.encoded}>{key}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="city_pop" className="block text-sm font-medium text-gray-300 mb-1">
                                                City Population
                                            </label>
                                            <input
                                                type="number"
                                                id="city_pop"
                                                name="city_pop"
                                                value={formData.city_pop}
                                                onChange={handleInputChange}
                                                readOnly
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-4">Location Map</h3>
                                    <p className="text-gray-400 mb-4">Blue marker is your location, red marker is merchant. Drag markers to change location.</p>
                                    <div ref={mapRef} className="h-96 w-full rounded-lg"></div>
                                </div>

                                <div className="text-center">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader size={20} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Predict'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* JSON Input Tab */}
                        {activeTab === 'json' && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Paste JSON Data</h3>
                                    <p className="text-gray-400 mb-4">Paste complete JSON object in format below. Only the "input" object will be used for prediction.</p>

                                    <form onSubmit={handleJsonSubmit}>
                                        <div>
                                            <label htmlFor="jsonInput" className="block text-sm font-medium text-gray-300 mb-1">
                                                JSON Input
                                            </label>
                                            <textarea
                                                id="jsonInput"
                                                name="jsonInput"
                                                value={jsonInput}
                                                onChange={(e) => setJsonInput(e.target.value)}
                                                rows={15}
                                                placeholder={`{
  "id": 1,
  "description": "Normal - Low amount grocery",
  "input": {
    "cc_num": 2291163933867244.0,
    "category": 10.0,
    "amt": 2.86,
    ...
  }
}`}
                                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white font-mono text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="text-center mt-4">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader size={20} className="animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    'Predict from JSON'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* API Documentation Tab */}
                        {activeTab === 'api' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Fraud Detection API Documentation</h3>
                                    <p className="text-gray-400 mb-6">Below are the available API endpoints for the Fraud Detection system:</p>

                                    <div className="space-y-4">
                                        {/* Prediction API */}
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <h4 className="font-semibold text-purple-300 mb-2">POST /api/predict</h4>
                                            <p className="text-gray-300 mb-4">Make a fraud prediction based on transaction data.</p>

                                            <h5 className="font-medium text-gray-300 mb-2">Request Body (JSON):</h5>
                                            <pre className="bg-gray-900 p-3 rounded-md text-sm text-gray-300 overflow-x-auto mb-4">
{`{
  "cc_num": 2291163933867244.0,
  "category": 10.0,
  "amt": 2.86,
  "gender": 1.0,
  "city": 168.0,
  "state": 40.0,
  "zip": 28202,
  "lat": 35.2271,
  "long": -80.8431,
  "city_pop": 897720,
  "merch_lat": 35.2300,
  "merch_long": -80.8600,
  "hour": 14.0,
  "dayofweek": 2.0,
  "month": 6.0,
  "age": 35.0
}`}
                                            </pre>

                                            <h5 className="font-medium text-gray-300 mb-2">Response:</h5>
                                            <pre className="bg-gray-900 p-3 rounded-md text-sm text-gray-300 overflow-x-auto">
{`{
  "id": 1,
  "description": "Normal - Low risk transaction",
  "input": {
    "cc_num": 2291163933867244.0,
    "category": 10.0,
    "amt": 2.86,
    "gender": 1.0,
    "city": 168.0,
    "state": 40.0,
    "zip": 28202,
    "lat": 35.2271,
    "long": -80.8431,
    "city_pop": 897720,
    "merch_lat": 35.2300,
    "merch_long": -80.8600,
    "hour": 14.0,
    "dayofweek": 2.0,
    "month": 6.0,
    "age": 35.0
  },
  "prediction": 0,
  "fraud_probability": 0.001234,
  "is_fraud": false,
  "distance_km": 2.14
}`}
                                            </pre>
                                        </div>

                                        {/* Categories API */}
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <h4 className="font-semibold text-purple-300 mb-2">GET /api/categories</h4>
                                            <p className="text-gray-300 mb-4">Get all available transaction categories.</p>

                                            <h5 className="font-medium text-gray-300 mb-2">Response:</h5>
                                            <pre className="bg-gray-900 p-3 rounded-md text-sm text-gray-300 overflow-x-auto">
{`{
  "Grocery": 10.0,
  "Online Shopping": 5.0,
  "Gas Transport": 3.0,
  "Restaurant": 7.0,
  "Jewelry": 9.0,
  "Misc": 5.0,
  "Personal Care": 12.0,
  "Home": 13.0
}`}
                                            </pre>
                                        </div>

                                        {/* Genders API */}
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <h4 className="font-semibold text-purple-300 mb-2">GET /api/genders</h4>
                                            <p className="text-gray-300 mb-4">Get all available gender options.</p>

                                            <h5 className="font-medium text-gray-300 mb-2">Response:</h5>
                                            <pre className="bg-gray-900 p-3 rounded-md text-sm text-gray-300 overflow-x-auto">
{`{
  "Female": 1.0,
  "Male": 0.0
}`}
                                            </pre>
                                        </div>

                                        {/* States API */}
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <h4 className="font-semibold text-purple-300 mb-2">GET /api/states</h4>
                                            <p className="text-gray-300 mb-4">Get all available states.</p>

                                            <h5 className="font-medium text-gray-300 mb-2">Response:</h5>
                                            <pre className="bg-gray-900 p-3 rounded-md text-sm text-gray-300 overflow-x-auto">
{`{
  "North Carolina": 40.0,
  "Utah": 44.0,
  "New York": 34.0,
  "Florida": 9.0,
  "Michigan": 22.0
}`}
                                            </pre>
                                        </div>

                                        {/* Cities API */}
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <h4 className="font-semibold text-purple-300 mb-2">GET /api/cities</h4>
                                            <p className="text-gray-300 mb-4">Get all available cities with their data.</p>

                                            <h5 className="font-medium text-gray-300 mb-2">Response:</h5>
                                            <pre className="bg-gray-900 p-3 rounded-md text-sm text-gray-300 overflow-x-auto">
{`{
  "Charlotte": {
    "encoded": 168.0,
    "population": 897720,
    "zip": 28202,
    "lat": 35.2271,
    "long": -80.8431
  },
  "Raleigh": {
    "encoded": 16.0,
    "population": 474069,
    "zip": 27601,
    "lat": 35.7796,
    "long": -78.6382
  },
  ...
}`}
                                            </pre>
                                        </div>

                                        {/* Days of Week API */}
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <h4 className="font-semibold text-purple-300 mb-2">GET /api/days_of_week</h4>
                                            <p className="text-gray-300 mb-4">Get all days of the week.</p>

                                            <h5 className="font-medium text-gray-300 mb-2">Response:</h5>
                                            <pre className="bg-gray-900 p-3 rounded-md text-sm text-gray-300 overflow-x-auto">
{`{
  "Monday": 0.0,
  "Tuesday": 1.0,
  "Wednesday": 2.0,
  "Thursday": 3.0,
  "Friday": 4.0,
  "Saturday": 5.0,
  "Sunday": 6.0
}`}
                                            </pre>
                                        </div>

                                        {/* Months API */}
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <h4 className="font-semibold text-purple-300 mb-2">GET /api/months</h4>
                                            <p className="text-gray-300 mb-4">Get all months of the year.</p>

                                            <h5 className="font-medium text-gray-300 mb-2">Response:</h5>
                                            <pre className="bg-gray-900 p-3 rounded-md text-sm text-gray-300 overflow-x-auto">
{`{
  "January": 1.0,
  "February": 2.0,
  "March": 3.0,
  "April": 4.0,
  "May": 5.0,
  "June": 6.0,
  "July": 7.0,
  "August": 8.0,
  "September": 9.0,
  "October": 10.0,
  "November": 11.0,
  "December": 12.0
}`}
                                            </pre>
                                        </div>

                                        {/* Hours API */}
                                        <div className="bg-gray-800 rounded-lg p-4">
                                            <h4 className="font-semibold text-purple-300 mb-2">GET /api/hours</h4>
                                            <p className="text-gray-300 mb-4">Get all hours of the day.</p>

                                            <h5 className="font-medium text-gray-300 mb-2">Response:</h5>
                                            <pre className="bg-gray-900 p-3 rounded-md text-sm text-gray-300 overflow-x-auto">
{`{
  "0": 0.0,
  "1": 1.0,
  "2": 2.0,
  ...
  "23": 23.0
}`}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Results Section - Added ref for auto-scroll */}
                        <div ref={resultsRef} className="mt-8">
                            {result && (
                                <>
                                    <h3 className="text-lg font-semibold mb-4">Prediction Results</h3>
                                    <div className={`p-6 rounded-lg ${result.is_fraud ? 'bg-red-900/20 border border-red-700' : 'bg-green-900/20 border border-green-700'}`}>
                                        <div className="flex items-center gap-3 mb-4">
                                            {result.is_fraud ? (
                                                <>
                                                    <AlertTriangle className="text-red-400" size={24} />
                                                    <span className="text-xl font-bold text-red-400">FRAUD DETECTED</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="text-green-400" size={24} />
                                                    <span className="text-xl font-bold text-green-400">NORMAL TRANSACTION</span>
                                                </>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-400">Fraud Probability</p>
                                                <p className="text-lg font-semibold">{(result.fraud_probability * 100).toFixed(2)}%</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Distance</p>
                                                <p className="text-lg font-semibold">{result.distance_km} km</p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-gray-400">Description</p>
                                            <p className="text-lg">{result.description}</p>
                                        </div>

                                        <div className="mt-6">
                                            <h4 className="font-medium mb-2">Full Result (JSON)</h4>
                                            <pre className="bg-gray-900 p-3 rounded-md text-sm text-gray-300 overflow-x-auto">
                                                {JSON.stringify(result, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
