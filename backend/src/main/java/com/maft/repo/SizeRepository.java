package com.maft.repo;

import com.maft.domain.SizeOption;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SizeRepository extends JpaRepository<SizeOption, String> {}
