package fr.wcs.Quizz4all.persistence.repositories;

import fr.wcs.Quizz4all.persistence.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}
