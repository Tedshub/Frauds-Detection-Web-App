<?php
// app/Http/Controllers/FraudController.php
namespace App\Http\Controllers;

use App\Models\Fraud;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FraudController extends Controller
{
    /**
     * Display a listing of fraud transactions.
     */
    public function index(): Response
    {
        // Mengambil semua data fraud dengan pagination
        $frauds = Fraud::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('FraudsPage', [
            'frauds' => $frauds
        ]);
    }

    /**
     * Display the specified fraud transaction.
     */
    public function show($id): Response
    {
        $fraud = Fraud::findOrFail($id);

        return Inertia::render('FraudDetail', [
            'fraud' => $fraud
        ]);
    }
}
