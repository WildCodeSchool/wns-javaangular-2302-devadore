package com.wcs.server.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;


import javax.crypto.SecretKey;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class JwtTokenProvider {


    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.refresh}")
    private static long jwtRefresh;
    private static SecretKey secretKey;
    private ConcurrentHashMap<String, Boolean> invalidatedTokens = new ConcurrentHashMap<>();

    @PostConstruct
    public void initSecretKey() {
        secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /***
     * Méthode génère un token JWT pour un utilisateur authentifié.
     * Le token contient le nom d'utilisateur de l'utilisateur, est signé avec une clé secrète, et expire après un certain délai.
     * Définit le sujet du token JWT comme étant le nom d'utilisateur de l'utilisateur.
     * Définit la date d'émission du token JWT.
     * Définit la date d'expiration du token JWT.
     * Signe le token JWT avec une clé secrète pour vérifier que le token n'a pas été modifié après avoir été émis.
     * Construit le token JWT et le retourne comme une chaîne de caractères.
     * @param authentication représente l'authentification d'un utilisateur, et retourne une chaîne de caractères qui est le token JWT.
     * @return le token JWT.
     */

    public String generateToken(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        String roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .setSubject(user.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .claim("roles", roles)
                .signWith(secretKey)
                .compact();
    }


    /***
     * extraire le nom d'utilisateur à partir d'un token JWT.
     * Analyse le token.
     * Définit la clé de signature utilisée pour vérifier la signature du token JWT.
     * Analyse le token JWT et le valide.
     * Récupère le corps du token JWT, qui est un objet Claims.
     * @param token
     * @return le nom d'utilisateur.
     */
    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    /***
     * Valider un token JWT
     * Crée un JwtParser qui est utilisé pour analyser et valider le token JWT.
     * Définit la clé de signature qui sera utilisée pour vérifier la signature du token JWT.
     * Analyse et valide le token JWT.
     * Vérifie si le token a été invalidé.
     * @type booléen
     * @param authToken
     * @return true si le token est valide et false dans le cas contraire.
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(authToken);

            if (isInvalidated(authToken)) {
                System.err.println("Token is invalidated: " + authToken);
                return false;
            }
            return true;
        } catch (io.jsonwebtoken.security.SignatureException | io.jsonwebtoken.security.WeakKeyException |
                 io.jsonwebtoken.io.DecodingException | io.jsonwebtoken.MalformedJwtException |
                 io.jsonwebtoken.ExpiredJwtException | io.jsonwebtoken.UnsupportedJwtException |
                 io.jsonwebtoken.MissingClaimException | io.jsonwebtoken.IncorrectClaimException ex) {

            System.err.println("Token validation failed: " + ex.getMessage());
        }
        return false;
    }

    /***
     * Extraire un token JWT (JSON Web Token) à partir d'une requête HTTP.
     * Vérifie si l'en-tête "Authorization" existe et commence par "Bearer " (type de schéma d'authentification).
     * @param req un String qui est le token JWT.
     * @return le token si il est présent et null dans le cas contraire.
     */
    public String resolveToken(HttpServletRequest req) {
        String bearerToken = req.getHeader("Authorization");
        System.out.println("Received Authorization header: " + bearerToken);
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /***
     * Génère un token de rafraîchissement JWT pour un utilisateur.
     * Le token contient le nom d'utilisateur de l'utilisateur, est signé avec une clé secrète, et expire après un certain délai.
     * @param username
     * @return le refresh token JWT.
     */
    public static String createRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtRefresh))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    /***
     * Valider un "refresh token" JWT (JSON Web Token). Elle retourne les "claims" (revendications) du token si celui-ci est valide.
     * Analyser et valider le token JWT.
     *
     * @param refreshToken
     * @return les revendications (informations contenues dans le token lui-même) du token si il est valide.
     */
    public static Claims validateRefreshToken(String refreshToken) {
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(refreshToken)
                    .getBody();
        } catch (Exception e) {
            throw new IllegalStateException("Invalid refresh token");
        }
    }

    /***
     * Gérer une liste de tokens invalidés.
     * Ajoute un token à une collection invalidatedTokens.
     * Vérifie si un token est dans la collection invalidatedTokens.
     * @param token
     * @return Si le token est dans la collection, il a été invalidé, la méthode retourne true.
     * Si le token n'est pas dans la collection, il n'a pas été invalidé, la méthode retourne false.
     */
    public void invalidate(String token) {
        invalidatedTokens.put(token, true);
    }

    public boolean isInvalidated(String token) {
        return invalidatedTokens.containsKey(token);
    }
}

