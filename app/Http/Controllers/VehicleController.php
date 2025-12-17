<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Customer;
use Inertia\Inertia;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vehicles = Vehicle::with('customer')->orderBy("updated_at", "desc")->get();
        $customers = Customer::orderBy('name', 'asc')->get();

        return Inertia::render('vehicles/index', [
            'vehicles' => $vehicles,
            'customers' => $customers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'plate_no' => 'required|string|max:255|unique:vehicles,plate_no',
        ]);

        Vehicle::create($validated);

        return redirect()->route('vehicle.index');
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'plate_no' => 'required|string|max:255|unique:vehicles,plate_no,' . $vehicle->id,
        ]);

        $vehicle->update($validated);

        return redirect()->route('vehicle.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();

        return redirect()->route('vehicle.index');
    }
}
