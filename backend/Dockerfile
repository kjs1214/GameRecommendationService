FROM openjdk:17-jdk-slim

WORKDIR /app
COPY . .

RUN ./gradlew build --no-daemon

EXPOSE 8080

# 앱 실행은 여기서
CMD ["./gradlew", "bootRun"]
