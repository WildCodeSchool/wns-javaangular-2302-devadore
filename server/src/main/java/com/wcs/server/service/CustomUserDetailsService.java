
package com.wcs.server.service;

import com.wcs.server.entity.Role;
import com.wcs.server.entity.User;
import com.wcs.server.repository.UserRepository;
import jakarta.transaction.Transactional;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /***
     * Charger les informations d'un utilisateur à partir d'une source de données et les présenter dans un format que Spring Security peut utiliser pour l'authentification et l'autorisation.
     * Les opérations sont traitées comme une seule unité de travail, et donc soit toutes réussissent, soit toutes échouent.
     * Méthode remplace une méthode de l'interface parente UserDetailsService.
     * Objets GrantedAuthority représentent les rôles ou privilèges que l'utilisateur a dans l'application.
     * @param username et renvoie un objet UserDetails.
     * @return un nouvel objet User (qui est une implémentation de l'interface UserDetails) est créé avec le nom d'utilisateur, le mot de passe et les autorités de l'utilisateur.
     * @throws UsernameNotFoundException Si l'utilisateur n'est pas trouvé
     */
    @Transactional
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        List<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : user.getRoles()) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }
}
