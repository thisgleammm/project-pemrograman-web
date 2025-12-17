<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $complaints = [
            'Mesin bunyi kasar saat dihidupkan pagi hari',
            'Rem kurang pakem dan berdecit',
            'AC tidak dingin hanya keluar angin',
            'Ganti Oli dan Service Berkala',
            'Lampu depan mati sebelah kiri',
            'Ada kebocoran oli di bagian bawah mesin',
            'Stir terasa berat saat belok',
            'Mobil tersendat saat digas',
            'Kopling terasa selip dan bau hangus',
            'Suspensi bunyi gluduk-gluduk saat lewat jalan rusak',
        ];

        return [
            'vehicle_id' => \App\Models\Vehicle::inRandomOrder()->first()->id ?? \App\Models\Vehicle::factory(),
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'mechanic_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'date' => fake()->dateTimeBetween('-1 month', 'now'),
            'complaint' => fake()->randomElement($complaints),
            'status' => fake()->randomElement(['pending', 'in_progress', 'completed', 'cancelled']),
        ];
    }
}
