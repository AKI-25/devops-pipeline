package main

import (
	"database/sql"
	"fmt"
	"log"
	"testing"
)

func TestSelectAllQuery(t *testing.T) {
	// Open a database connection (replace with your actual connection details)
	db, err := sql.Open("postgres", "postgres://postgres:postgres@result-db-service:5432/votes?sslmode=disable")
	if err != nil {
		t.Fatalf("Error opening database connection: %v", err)
	}
	defer db.Close()

	// Execute a select all query from public.vote_count
	rows, err := db.Query("SELECT * FROM public.vote_count")
	if err != nil {
		t.Fatalf("Error executing query: %v", err)
	}
	defer rows.Close()

	// Process and print the results
	columns, err := rows.Columns()
	if err != nil {
		t.Fatalf("Error getting columns: %v", err)
	}

	// Create a slice of interface{} to store column values
	values := make([]interface{}, len(columns))
	for i := range values {
		values[i] = new(interface{})
	}

	for rows.Next() {
		err := rows.Scan(values...)
		if err != nil {
			t.Fatalf("Error scanning row: %v", err)
		}

		for i, value := range values {
			fmt.Printf("%s: %v\t", columns[i], *value.(*interface{}))
		}
		fmt.Println()
	}
}

// Add more test functions as needed
