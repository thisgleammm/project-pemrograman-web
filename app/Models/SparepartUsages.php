<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SparepartUsages extends Model
{
    use HasFactory;

    protected $table = 'sparepart_usages';
    protected $fillable = [
        'booking_id',
        'sparepart_id',
        'qty',
        'price_at_use',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function sparepart()
    {
        return $this->belongsTo(Sparepart::class);
    }
}
