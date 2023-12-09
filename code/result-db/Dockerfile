# Use the official PostgreSQL image
FROM postgres:latest

# Set environment variables
ENV POSTGRES_DB votes
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres

# Copy SQL script to initialize the database
COPY init.sql /docker-entrypoint-initdb.d/