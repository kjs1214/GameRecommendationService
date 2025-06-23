# 1단계: Gradle 빌드 전용
FROM gradle:8.4-jdk17-alpine AS builder
WORKDIR /app
COPY --chown=gradle:gradle . .
RUN gradle build --no-daemon

# 2단계: 실행용 (최소 이미지)
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

# 메모리 제한 (자바 힙)
ENV JAVA_OPTS="-Xms64m -Xmx256m"
EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
