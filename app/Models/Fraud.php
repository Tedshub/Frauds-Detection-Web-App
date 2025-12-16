<?php
// app/Models/Fraud.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fraud extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'frauds';

    /**
     * Kolom-kolom yang dapat diisi secara massal (mass assignment).
     *
     * @var array
     */
    protected $fillable = [
        'description',
        'cc_num',
        'category',
        'amt',
        'gender',
        'city',
        'state',
        'zip',
        'lat',
        'long',
        'city_pop',
        'merch_lat',
        'merch_long',
        'hour',
        'dayofweek',
        'month',
        'age',
    ];
}
