<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $customers = Customer::orderBy('updated_at', 'desc')->get();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:customer,email',
            'address' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        Customer::create($validated);

        return redirect()->route('customer.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:customer,email,' . $customer->id,
            'address' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $customer->update($validated);

        return redirect()->route('customer.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->delete();

        return redirect()->route('customer.index');
    }
}
