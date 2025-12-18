<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMutation extends Model
{
    use HasFactory;

    protected $fillable = [
        'sparepart_id',
        'change',
        'reason',
        'reference_id',
    ];

    /**
     * Mutation reasons
     */
    const REASON_USAGE = 'sparepart_usage';
    const REASON_USAGE_DELETED = 'sparepart_usage_deleted';
    const REASON_ADJUSTMENT = 'adjustment';
    const REASON_PURCHASE = 'purchase';

    public function sparepart()
    {
        return $this->belongsTo(Sparepart::class);
    }
}
