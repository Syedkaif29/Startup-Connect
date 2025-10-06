FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

# Do NOT bake secrets into the image. Provide DB and secret values at deploy/run time.
# Set these environment variables in your deployment platform (Render dashboard),
# or pass them with `docker run --env` / `--env-file` when testing locally.
# Expected environment variables (examples):
#   SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<db>
#   SPRING_DATASOURCE_USERNAME=<db_user>
#   SPRING_DATASOURCE_PASSWORD=<db_password>
#   JWT_SECRET=<very-secret-value>
# Optional: SPRING_JPA_HIBERNATE_DDL_AUTO (e.g. update) and SPRING_PROFILES_ACTIVE

ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update
ENV SPRING_PROFILES_ACTIVE=prod
ENV SPRING_JPA_SHOW_SQL=true
ENV SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL=true

ENTRYPOINT ["java", "-jar", "app.jar"] 