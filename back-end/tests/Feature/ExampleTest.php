<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * The application health endpoint responds successfully.
     */
    public function test_the_application_health_endpoint_returns_successful_response(): void
    {
        $response = $this->get('/up');

        $response->assertStatus(200);
    }
}