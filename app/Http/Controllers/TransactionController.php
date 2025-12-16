<?php
// app/Http/Controllers/TransactionController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Fraud;

class TransactionController extends Controller
{
    /**
     * Display the transaction fraud detection page.
     */
    public function index(): Response
    {
        // Fetch dropdown options from Python backend
        // Menggunakan konfigurasi dari services.php untuk fleksibilitas
        $baseUrl = config('services.python_api.base_url');

        try {
            $categoriesResponse = Http::get($baseUrl . '/api/categories');
            $categories = $categoriesResponse->json();

            $gendersResponse = Http::get($baseUrl . '/api/genders');
            $genders = $gendersResponse->json();

            $statesResponse = Http::get($baseUrl . '/api/states');
            $states = $statesResponse->json();

            $citiesResponse = Http::get($baseUrl . '/api/cities');
            $cities = $citiesResponse->json();

            $daysOfWeekResponse = Http::get($baseUrl . '/api/days_of_week');
            $daysOfWeek = $daysOfWeekResponse->json();

            $monthsResponse = Http::get($baseUrl . '/api/months');
            $months = $monthsResponse->json();

            $hoursResponse = Http::get($baseUrl . '/api/hours');
            $hours = $hoursResponse->json();
        } catch (\Exception $e) {
            // If there's an error fetching data, use empty arrays
            $categories = [];
            $genders = [];
            $states = [];
            $cities = [];
            $daysOfWeek = [];
            $months = [];
            $hours = [];
        }

        return Inertia::render('Transactions', [
            'categories' => $categories,
            'genders' => $genders,
            'states' => $states,
            'cities' => $cities,
            'daysOfWeek' => $daysOfWeek,
            'months' => $months,
            'hours' => $hours,
            'apiBaseUrl' => $baseUrl
        ]);
    }

    /**
     * Get city data from Python backend.
     */
    public function getCityData($cityName)
    {
        // Menggunakan konfigurasi dari services.php untuk fleksibilitas
        $baseUrl = config('services.python_api.base_url');

        try {
            $response = Http::get($baseUrl . '/get_city_data/' . urlencode($cityName));
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json(["encoded" => 0.0, "population" => 0, "zip" => 0, "lat" => 0.0, "long" => 0.0]);
        }
    }

    /**
     * Get categories from Python backend.
     */
    public function getCategories()
    {
        // Menggunakan konfigurasi dari services.php untuk fleksibilitas
        $baseUrl = config('services.python_api.base_url');

        try {
            $response = Http::get($baseUrl . '/api/categories');
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Get genders from Python backend.
     */
    public function getGenders()
    {
        // Menggunakan konfigurasi dari services.php untuk fleksibilitas
        $baseUrl = config('services.python_api.base_url');

        try {
            $response = Http::get($baseUrl . '/api/genders');
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Get states from Python backend.
     */
    public function getStates()
    {
        // Menggunakan konfigurasi dari services.php untuk fleksibilitas
        $baseUrl = config('services.python_api.base_url');

        try {
            $response = Http::get($baseUrl . '/api/states');
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Get cities from Python backend.
     */
    public function getCities()
    {
        // Menggunakan konfigurasi dari services.php untuk fleksibilitas
        $baseUrl = config('services.python_api.base_url');

        try {
            $response = Http::get($baseUrl . '/api/cities');
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Get days of week from Python backend.
     */
    public function getDaysOfWeek()
    {
        // Menggunakan konfigurasi dari services.php untuk fleksibilitas
        $baseUrl = config('services.python_api.base_url');

        try {
            $response = Http::get($baseUrl . '/api/days_of_week');
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Get months from Python backend.
     */
    public function getMonths()
    {
        // Menggunakan konfigurasi dari services.php untuk fleksibilitas
        $baseUrl = config('services.python_api.base_url');

        try {
            $response = Http::get($baseUrl . '/api/months');
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Get hours from Python backend.
     */
    public function getHours()
    {
        // Menggunakan konfigurasi dari services.php untuk fleksibilitas
        $baseUrl = config('services.python_api.base_url');

        try {
            $response = Http::get($baseUrl . '/api/hours');
            return response()->json($response->json());
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Predict fraud using Python backend and save to database if fraud is detected.
     */
    public function predict(Request $request)
    {
        $baseUrl = config('services.python_api.base_url');

        try {
            $response = Http::post($baseUrl . '/api/predict', $request->all());
            $predictionData = $response->json();

            // Cek apakah prediksi adalah FRAUD
            if (isset($predictionData['is_fraud']) && $predictionData['is_fraud'] === true) {
                // Jika ya, ambil data input dari respons
                $inputData = $predictionData['input'];

                // Simpan data ke tabel 'frauds' dengan memetakan setiap properti
                Fraud::create([
                    'description' => $predictionData['description'],
                    'cc_num' => $inputData['cc_num'],
                    'category' => $inputData['category'],
                    'amt' => $inputData['amt'],
                    'gender' => $inputData['gender'],
                    'city' => $inputData['city'],
                    'state' => $inputData['state'],
                    'zip' => $inputData['zip'],
                    'lat' => $inputData['lat'],
                    'long' => $inputData['long'],
                    'city_pop' => $inputData['city_pop'],
                    'merch_lat' => $inputData['merch_lat'],
                    'merch_long' => $inputData['merch_long'],
                    'hour' => $inputData['hour'],
                    'dayofweek' => $inputData['dayofweek'],
                    'month' => $inputData['month'],
                    'age' => $inputData['age'],
                ]);
            }

            // Kembalikan respons prediksi asli ke frontend
            return response()->json($predictionData);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
