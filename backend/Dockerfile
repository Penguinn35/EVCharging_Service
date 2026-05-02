FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Chạy file .jar
FROM eclipse-temurin:21-jre
WORKDIR /app
# Copy file .jar từ stage 1 sang stage 2
COPY --from=build /app/target/*.jar app.jar
# Mở port 8080 cho Render
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]