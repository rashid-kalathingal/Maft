package com.maft.repo;

import com.maft.domain.Colour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColourRepository extends JpaRepository<Colour, String> {}
