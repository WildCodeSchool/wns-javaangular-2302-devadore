package com.wcs.server.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private JwtTokenProvider tokenProvider;
    private UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(UserDetailsService userDetailsService, JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    /***
     * Méthode extrait le token JWT de la requête, valide le token, extrait le nom d'utilisateur du token, charge les détails de l'utilisateur,
     * crée un objet d'authentification, place l'authentification dans le SecurityContext, et passe la requête à la prochaine étape de la chaîne de filtres.
     * Extrait le token JWT de la requête HTTP en utilisant une méthode de l'objet tokenProvider.
     * Vérifie si le token JWT n'est pas null et s'il est valide.
     * Extrait le nom d'utilisateur du token JWT.
     * Charge les détails de l'utilisateur à partir du nom d'utilisateur extrait du token JWT.
     * Vérifie si les détails de l'utilisateur ne sont pas null.
     * Crée un nouvel objet UsernamePasswordAuthenticationToken qui représente l'authentification de l'utilisateur.
     * Place l'authentification de l'utilisateur dans le SecurityContext, ce qui permet à Spring Security de reconnaître que l'utilisateur est authentifié pour cette requête.
     * Passe la requête et la réponse à la prochaine étape de la chaîne de filtres de sécurité.
     * @param request
     * @param response
     * @param filterChain
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {      
        try {
            String jwt = tokenProvider.resolveToken(request);

            if (jwt != null && tokenProvider.validateToken(jwt)) {
                String username = tokenProvider.getUsernameFromJWT(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (userDetails != null) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            logger.error("An error occurred during authentication:", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("An error occurred during authentication. Please try again later.");
            throw e;
        }

        filterChain.doFilter(request, response);
    }

}
