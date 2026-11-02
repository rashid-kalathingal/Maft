package com.maft.web;

import com.maft.domain.AppSetting;
import com.maft.repo.AppSettingRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingController {

    private final AppSettingRepository repo;

    public SettingController(AppSettingRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public AppSetting get() {
        return repo.findById(AppSetting.SINGLETON_ID).orElseGet(AppSetting::new);
    }

    @PutMapping
    public AppSetting update(@RequestBody AppSetting incoming) {
        incoming.id = AppSetting.SINGLETON_ID;
        return repo.save(incoming);
    }
}
