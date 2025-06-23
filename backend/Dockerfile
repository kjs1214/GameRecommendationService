# ✅ 1단계: Gradle 빌드용 스테이지
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app

# Gradle 관련 파일 먼저 복사 (캐시 최적화)
COPY build.gradle settings.gradle gradlew gradlew.bat ./
COPY gradle ./gradle

# 의존성만 먼저 설치
RUN ./gradlew dependencies --no-daemon

# 전체 소스 복사 후 빌드
COPY . .
RUN ./gradlew clean build --no-daemon

# ✅ 2단계: 실행을 위한 경량 이미지
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# 빌드된 JAR 파일만 가져오기
COPY --from=builder /app/build/libs/*.jar app.jar

# 메모리 최적화: Render 무료 tier 512Mi이므로 제한 설정
ENV JAVA_OPTS="-Xms64m -Xmx256m"

# 8080 포트 노출
EXPOSE 8080

# 앱 실행
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
