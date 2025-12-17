<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vehicle extends Model
{
    use HasFactory;
    protected $table = 'vehicles';

    protected $fillable = [
        'customer_id',
        'brand',
        'model',
        'year',
        'plate_no',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
