package csulzc.medical_big_data_cloud.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-expiration:900000}")
    private long accessExpiration;

    private SecretKey signingKey;

    @PostConstruct
    public void init() {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("JWT secret must contain at least 32 bytes");
        }
        signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(CustomUserDetails userDetails) {
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plusMillis(accessExpiration);
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("uid", userDetails.getId())
                .claim("role", userDetails.getRoleCode())
                .claim("ver", userDetails.getTokenVersion())
                .claim("type", "access")
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(expiresAt))
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    public boolean validateAccessToken(String token, CustomUserDetails userDetails) {
        try {
            Claims claims = parseClaims(token);
            Number version = claims.get("ver", Number.class);
            return "access".equals(claims.get("type", String.class))
                    && userDetails.getUsername().equals(claims.getSubject())
                    && version != null
                    && version.intValue() == userDetails.getTokenVersion()
                    && claims.getExpiration().after(new Date())
                    && userDetails.isEnabled();
        } catch (Exception exception) {
            return false;
        }
    }

    public String getUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public Instant getAccessExpiresAt(String token) {
        return parseClaims(token).getExpiration().toInstant();
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
