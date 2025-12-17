<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehicle>
 */
class VehicleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "customer_id"=> fake()->numberBetween(1, 25),
            "brand"=> fake()->randomElement(['Toyota', 'Honda', 'Suzuki', 'Mitsubishi', 'Daihatsu', 'Nissan', 'Hyundai', 'Wuling', 'Mazda']),
            "model"=> fake()->randomElement(['Avanza', 'Xenia', 'Brio', 'Pajero', 'Fortuner', 'Alphard', 'Jazz', 'HR-V', 'CR-V', 'Innova', 'Rush', 'Terios']),
            "year"=> fake()->numberBetween(2015, date('Y')),
            "plate_no"=> fake()->toUpper(fake()->randomElement(['B', 'D', 'F', 'A', 'H', 'N']) . ' ' . fake()->numberBetween(1000, 9999) . ' ' . fake()->lexify('??')),
        ];
    }
}
