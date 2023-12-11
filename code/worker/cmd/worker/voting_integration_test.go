package main

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/go-redis/redis/v8"
)

func TestRedisConnection(t *testing.T) {
	// Replace these values with your actual Redis connection details
	redisAddr := "voting-db-service:6379"
	redisPassword := ""
	redisDB := 0

	// Create a Redis client
	client := redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: redisPassword,
		DB:       redisDB,
	})

	// Ping the Redis server to check the connection
	pong, err := client.Ping(context.Background()).Result()
	if err != nil {
		t.Fatalf("Error pinging Redis server: %v", err)
	}

	if pong != "PONG" {
		t.Fatalf("Expected PONG, got: %s", pong)
	}

	fmt.Println("Redis connection successful!")
}

func TestSetAndGetRedisKey(t *testing.T) {
	// Replace these values with your actual Redis connection details
	redisAddr := "voting-db-service:6379"
	redisPassword := ""
	redisDB := 0

	// Create a Redis client
	client := redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: redisPassword,
		DB:       redisDB,
	})

	// Key-value pair to set and get
	key := "votes:Athena"
	value := "0"

	// Set the key in Redis
	err := client.Set(context.Background(), key, value, 0).Err()
	if err != nil {
		t.Fatalf("Error setting Redis key: %v", err)
	}

	// Get the key from Redis
	result, err := client.Get(context.Background(), key).Result()
	if err != nil {
		t.Fatalf("Error getting Redis key: %v", err)
	}

	if result != value {
		t.Fatalf("Expected value: %s, got: %s", value, result)
	}

	fmt.Printf("Redis key %s has value: %s\n", key, result)
}

// Add more test functions as needed
