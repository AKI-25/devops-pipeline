#!/bin/bash

# Start the Redis server
redis-server &

# Wait for the Redis server to start
sleep 5

# Use the Redis CLI to set initial values for keys
redis-cli SET votes:Athena 0
redis-cli SET votes:Rome 0

# Keep the container running
tail -f /dev/null