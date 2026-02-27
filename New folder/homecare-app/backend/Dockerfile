# Build stage
FROM maven:3.9.12-eclipse-temurin-22 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:22-jre
WORKDIR /app
COPY --from=builder /app/target/homecare-registration-1.0.0.jar app.jar

EXPOSE 8080
ENV PORT=8080 \
    JAVA_OPTS="-Xmx512m"

ENTRYPOINT ["java", "-jar", "app.jar"]
