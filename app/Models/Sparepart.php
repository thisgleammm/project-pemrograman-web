<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sparepart extends Model
{
    use HasFactory;
    protected $fillable = [
        'sku',
        'name',
        'price',
        'stock',
        'min_stock',
    ];

    public function stockMutations()
    {
        return $this->hasMany(StockMutation::class);
    }
}
