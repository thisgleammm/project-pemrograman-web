<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Customer;
use App\Models\Sparepart;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Customer::factory(25)->create();
        Vehicle::factory(25)->create();
        Sparepart::factory(25)->create();
        Booking::factory(25)->create();
        RoleSeeder::factory(25)->create();
    }
}
