<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        
        $query = Booking::with(['user', 'vehicle'])
            ->orderBy("updated_at", "desc");

        if (!$user->hasRole('admin')) {
            $query->where('user_id', $user->id);
        }

        $bookings = $query->get();
        $users = User::orderBy('name', 'asc')->get(); // For admin dropdowns if needed

        return Inertia::render('bookings/index', [
            'bookings' => $bookings,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'date' => 'required|date',
            'complaint' => 'required|string',
            'status' => 'required|string|in:pending,in_progress,completed,cancelled',
            'mechanic_id' => 'nullable|exists:users,id',
        ]);

        // Force user_id to current user if not admin, or validate if admin
        if (!Auth::user()->hasRole('admin')) {
             $validated['user_id'] = Auth::id();
        } else {
             $request->validate(['user_id' => 'required|exists:users,id']);
             $validated['user_id'] = $request->user_id;
        }

        Booking::create($validated);

        return redirect()->route('booking.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        $user = Auth::user();

        // Authorization check: Only admin or owner can update
        // But usually only admin/mechanic updates status
        if (!$user->hasRole('admin') && $booking->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $rules = [
            'date' => 'sometimes|date',
            'complaint' => 'sometimes|string',
            'status' => 'sometimes|string|in:pending,in_progress,completed,cancelled',
        ];

        if ($user->hasRole('admin')) {
             $rules['mechanic_id'] = 'nullable|exists:users,id';
             $rules['user_id'] = 'sometimes|exists:users,id';
             $rules['vehicle_id'] = 'sometimes|exists:vehicles,id';
        }

        $validated = $request->validate($rules);

        $booking->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        if (!Auth::user()->hasRole('admin') && $booking->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }
        
        $booking->delete();

        return redirect()->route('booking.index');
    }
}
