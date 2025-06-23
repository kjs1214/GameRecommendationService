FROM openjdk:17-jdk-slim

WORKDIR /app
COPY . .


RUN ./gradlew --no-daemon clean build --refresh-dependencies


EXPOSE 8080

# 앱 실행은 여기서
CMD ["./gradlew", "bootRun"]
