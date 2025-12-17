<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sparepart>
 */
class SparepartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $parts = [
            'Oil Filter', 'Air Filter', 'Brake Pad Set', 'Spark Plug', 'Battery',
            'Alternator', 'Starter Motor', 'Radiator', 'Water Pump', 'Fuel Pump',
            'Timing Belt', 'Drive Belt', 'Shock Absorber', 'Strut Assembly', 'Control Arm',
            'Ball Joint', 'Tie Rod End', 'Wheel Bearing', 'Brake Rotor', 'Clutch Kit',
            'Headlight Bulb', 'Wiper Blade', 'Ignition Coil', 'Oxygen Sensor', 'Catalytic Converter'
        ];

        return [
            'sku' => $this->faker->unique()->bothify('PART-####-??'),
            'name' => $this->faker->randomElement($parts) . ' ' . $this->faker->bothify('##'),
            'price' => $this->faker->numberBetween(50, 5000) * 1000, // IDR currency simulation
            'stock' => $this->faker->numberBetween(0, 100),
            'min_stock' => $this->faker->numberBetween(5, 20),
        ];
    }
}
