<?php

namespace App\Http\Controllers;

use App\Models\SparepartUsages;
use App\Models\Booking;
use App\Models\Sparepart;
use App\Models\StockMutation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SparepartUsageController extends Controller
{
    /**
     * Store a newly created sparepart usage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'sparepart_id' => 'required|exists:spareparts,id',
            'qty' => 'required|integer|min:1',
        ]);

        // Get booking and check authorization
        $booking = Booking::findOrFail($validated['booking_id']);
        $user = Auth::user();

        if (!$user->hasRole('admin') && $booking->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // Get sparepart and validate stock
        $sparepart = Sparepart::findOrFail($validated['sparepart_id']);
        
        if ($sparepart->stock < $validated['qty']) {
            return redirect()->back()->withErrors([
                'qty' => "Insufficient stock. Available: {$sparepart->stock}, Requested: {$validated['qty']}"
            ])->withInput();
        }

        // Wrap in DB transaction
        DB::transaction(function () use ($validated, $sparepart, $booking) {
            // Check if sparepart already used in this booking
            $existingUsage = SparepartUsages::where('booking_id', $validated['booking_id'])
                ->where('sparepart_id', $validated['sparepart_id'])
                ->first();

            if ($existingUsage) {
                // Update existing usage - increment qty
                $existingUsage->increment('qty', $validated['qty']);
                $usageId = $existingUsage->id;
            } else {
                // Create new sparepart usage
                $usage = SparepartUsages::create([
                    'booking_id' => $validated['booking_id'],
                    'sparepart_id' => $validated['sparepart_id'],
                    'qty' => $validated['qty'],
                    'price_at_use' => $sparepart->price,
                ]);
                $usageId = $usage->id;
            }

            // Decrement stock
            $sparepart->decrement('stock', $validated['qty']);

            // Log stock mutation
            StockMutation::create([
                'sparepart_id' => $sparepart->id,
                'change' => -$validated['qty'],
                'reason' => StockMutation::REASON_USAGE,
                'reference_id' => $usageId,
            ]);
        });

        return redirect()->back();
    }

    /**
     * Remove the specified sparepart usage.
     */
    public function destroy(SparepartUsages $sparepartUsage)
    {
        $user = Auth::user();
        $booking = $sparepartUsage->booking;

        if (!$user->hasRole('admin') && $booking->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // Wrap in DB transaction
        DB::transaction(function () use ($sparepartUsage) {
            $sparepart = $sparepartUsage->sparepart;
            $qty = $sparepartUsage->qty;
            $usageId = $sparepartUsage->id;

            // Delete usage
            $sparepartUsage->delete();

            // Increment stock (return stock)
            $sparepart->increment('stock', $qty);

            // Log stock mutation
            StockMutation::create([
                'sparepart_id' => $sparepart->id,
                'change' => $qty,
                'reason' => StockMutation::REASON_USAGE_DELETED,
                'reference_id' => $usageId,
            ]);
        });

        return redirect()->back();
    }
}
