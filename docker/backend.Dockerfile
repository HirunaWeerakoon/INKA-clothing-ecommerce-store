# ============================================================
# INKA Backend — Multi-Stage Dockerfile
# ============================================================
# STAGE 1: BUILD
#   Uses the full JDK + Maven to compile and package the JAR.
#   This image is large (~500MB) but is NEVER shipped to prod.
# ============================================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and pom.xml first (Docker caches this layer
# so re-builds are fast as long as pom.xml hasn't changed)
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn/ .mvn/
COPY pom.xml .

# Download all dependencies — separate layer for caching
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source code and build the JAR, skipping tests
# (tests are run by GitHub Actions before this Dockerfile is invoked)
COPY src/ src/
RUN ./mvnw package -DskipTests -B

# ============================================================
# STAGE 2: RUNTIME
#   Uses only the JRE (no compiler, no Maven) — much smaller (~90MB).
#   Only the compiled JAR is copied from the builder stage.
# ============================================================
FROM eclipse-temurin:21-jre-alpine AS runtime

# Security best-practice: run as non-root user
RUN addgroup -S inka && adduser -S inka -G inka
USER inka

WORKDIR /app

# Copy ONLY the fat JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Spring Boot runs on port 8080 by default
EXPOSE 8080

# Health check: Docker/Kubernetes will use this to know if the
# container is actually ready to receive traffic
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
