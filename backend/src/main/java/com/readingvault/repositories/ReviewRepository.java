package com.readingvault.repositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.readingvault.models.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {}