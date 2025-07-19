FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

# Set environment variables for database connection
# ENV SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-d07363k9c44c739l7iu0-a/st_myko
# ENV SPRING_DATASOURCE_USERNAME=st_myko_user
# ENV SPRING_DATASOURCE_PASSWORD=QmRzJ2T9ugSGnEqy9MZ1CjHgw9YFB3EG
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://dpg-d1tv54s9c44c73cfm930-a/startup_bnk4
ENV SPRING_DATASOURCE_USERNAME=startup_bnk4_user
ENV SPRING_DATASOURCE_PASSWORD=lp33bnkeNQJm6pXwztS1bH8IIruE3BIu
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update
ENV SPRING_PROFILES_ACTIVE=prod
ENV JWT_SECRET=8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb
ENV SPRING_JPA_SHOW_SQL=true
ENV SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL=true

ENTRYPOINT ["java", "-jar", "app.jar"] 