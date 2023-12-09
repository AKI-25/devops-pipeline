# Use an official Redis image as the base image
FROM redis:latest

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy the custom initialization script into the container
COPY init.sh /usr/src/app/

# Make the initialization script executable
RUN chmod +x init.sh

# Run the initialization script when the container starts
CMD ["./init.sh"]