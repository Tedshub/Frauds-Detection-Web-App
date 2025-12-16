<?php
// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Fraud; // Import the Fraud model

class DashboardController extends Controller
{
    /**
     * Display the dashboard page.
     *
     * @return Response
     */
    public function index(): Response
    {
        // Fetch the 5 most recent fraudulent transactions from the database
        // Order by creation date in descending order to get the newest first
        $recentFrauds = Fraud::orderBy('created_at', 'desc')->take(5)->get();

        // Render the Dashboard component and pass the recent frauds data as a prop
        return Inertia::render('Dashboard', [
            'recentFrauds' => $recentFrauds
        ]);
    }
}
