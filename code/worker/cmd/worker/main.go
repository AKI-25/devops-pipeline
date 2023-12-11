package main

import (
	"database/sql"
	"fmt"
	"log"
	"net"
	"time"
	"strconv"

	"github.com/go-redis/redis/v8"
	_ "github.com/lib/pq"
)

type Vote struct {
    Art1 int `json:"art1"`
    Art2 int `json:"art2"`
}

func main() {
    db := openDBConnection("postgres://postgres:postgres@result-db-service:5432/votes?sslmode=disable")
    redisClient := openRedisConnection("voting-db-service:6379")

    keepAliveQuery := "SELECT 1"

    // Create 'votes' table if not exists
    _, err := db.Exec(`
        CREATE TABLE IF NOT EXISTS vote_count (
            id SERIAL PRIMARY KEY,
            art1 INTEGER,
            art2 INTEGER
        );
    `)
    if err != nil {
        log.Fatal(err)
    }

    for {
        time.Sleep(1000 * time.Millisecond)

        // Reconnect to Redis if down
        if _, err := redisClient.Ping(redisClient.Context()).Result(); err != nil {
            fmt.Println("Reconnecting Redis")
            redisClient = openRedisConnection("voting-db-service:6379")
        }
// Retrieve values from Redis keys
jsonValueAthena, err := redisClient.Get(redisClient.Context(), "votes:Athena").Result()
if err != nil {
    if err == redis.Nil {
        // Key not found, handle accordingly (e.g., log or continue)
        log.Println("Key not found in Redis: votes:Athena")
    } else {
        // Handle other errors
        log.Println(err)
    }

    // Keep the database connection alive with a simple query
    _, err := db.Exec(keepAliveQuery)
    if err != nil {
        log.Println("Reconnecting DB")
        db = openDBConnection("postgres://postgres:postgres@result-db-service:5432/votes?sslmode=disable")
    }
    continue
}

jsonValueRome, err := redisClient.Get(redisClient.Context(), "votes:Rome").Result()
if err != nil {
    if err == redis.Nil {
        // Key not found, handle accordingly (e.g., log or continue)
        log.Println("Key not found in Redis: votes:Rome")
    } else {
        // Handle other errors
        log.Println(err)
    }

    // Keep the database connection alive with a simple query
    _, err := db.Exec(keepAliveQuery)
    if err != nil {
        log.Println("Reconnecting DB")
        db = openDBConnection("postgres://postgres:postgres@result-db-service:5432/votes?sslmode=disable")
    }
    continue
}

// Convert string values to integers
voteAthena, err := strconv.Atoi(jsonValueAthena)
if err != nil {
    log.Println(err)
    continue
}

voteRome, err := strconv.Atoi(jsonValueRome)
if err != nil {
    log.Println(err)
    continue
}

// Create a single Vote struct with both values
mergedVote := &Vote{
    Art1: voteAthena,
    Art2: voteRome,
}

// Process the merged vote
fmt.Printf("Processing merged vote - Art1: %d, Art2: %d\n", mergedVote.Art1, mergedVote.Art2)

// Update the database with the merged vote
err = updateVote(db, mergedVote.Art1, mergedVote.Art2)
if err != nil {
    log.Println(err)
}

    }
}

func updateVote(db *sql.DB, art1, art2 int) error {
    tx, err := db.Begin()
    if err != nil {
        return err
    }
    defer tx.Rollback()

    // Check if the record already exists
    var count int
    err = tx.QueryRow("SELECT COUNT(*) FROM vote_count").Scan(&count)
    if err != nil {
        return err
    }

    if count > 0 {
        // Update existing record
        _, err = tx.Exec(`
            UPDATE vote_count SET art1 = $1, art2 = $2;
        `, art1, art2)
    } else {
        // Insert new record
        _, err = tx.Exec(`
            INSERT INTO vote_count (art1, art2) VALUES ($1, $2);
        `, art1, art2)
    }

    if err != nil {
        return err
    }

    return tx.Commit()
}

func openDBConnection(connectionString string) *sql.DB {
	for {
		db, err := sql.Open("postgres", connectionString)

		if err == nil {
			fmt.Printf("Connected to Postgres at %s\n", connectionString)

			//********USED for Testing********//
			// // Execute a select all query from public.vote_count
			// rows, err := db.Query("SELECT * FROM public.vote_count")
			// if err != nil {
			// 	log.Fatal(err)
			// }
			// defer rows.Close()

			// // Process and print the results
			// columns, err := rows.Columns()
			// if err != nil {
			// 	log.Fatal(err)
			// }

			// // Create a slice of interface{} to store column values
			// values := make([]interface{}, len(columns))
			// for i := range values {
			// 	values[i] = new(interface{})
			// }

			// for rows.Next() {
			// 	err := rows.Scan(values...)
			// 	if err != nil {
			// 		log.Fatal(err)
			// 	}

			// 	for i, value := range values {
			// 		fmt.Printf("%s: %v\t", columns[i], *value.(*interface{}))
			// 	}
			// 	fmt.Println()
			// }

			return db
		}

		if _, ok := err.(net.Error); ok {
			fmt.Println("Waiting for DB")
			time.Sleep(1 * time.Second)
		} else {
			log.Fatal(err)
		}
	}
}


func openRedisConnection(addr string) *redis.Client {
	for {
		client := redis.NewClient(&redis.Options{
			Addr: addr,
		})

		_, err := client.Ping(client.Context()).Result()
		if err == nil {
			fmt.Printf("Connected to Redis at %s\n", addr)

			//********USED for Testing********//
			// Get the values of the keys "votes:Athena" and "votes:Rome"
			// athenaVotes, err := client.Get(client.Context(), "votes:Athena").Result()
			// if err != nil && err != redis.Nil {
			// 	log.Println("Error getting value for key 'votes:Athena':", err)
			// } else {
			// 	fmt.Printf("Votes for Athena: %s\n", athenaVotes)
			// }

			// romeVotes, err := client.Get(client.Context(), "votes:Rome").Result()
			// if err != nil && err != redis.Nil {
			// 	log.Println("Error getting value for key 'votes:Rome':", err)
			// } else {
			// 	fmt.Printf("Votes for Rome: %s\n", romeVotes)
			// }

			return client
		}

		if _, ok := err.(net.Error); ok {
			fmt.Println("Waiting for Redis")
			time.Sleep(1 * time.Second)
		} else {
			log.Fatal(err)
		}
	}
}
