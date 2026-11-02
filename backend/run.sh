#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Run Spring Boot with Supabase profile
SPRING_PROFILES_ACTIVE=supabase mvn spring-boot:run
