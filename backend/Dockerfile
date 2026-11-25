# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
# Retry transient Maven Central failures (e.g. 429 Too Many Requests) instead of
# failing the whole build; wait between retries.
ENV MAVEN_OPTS="-Dmaven.wagon.http.retryHandler.count=6 -Dmaven.wagon.httpconnectionManager.ttlSeconds=120 -Dmaven.wagon.rto=60000"
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B clean package -DskipTests

# ---- Run stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
