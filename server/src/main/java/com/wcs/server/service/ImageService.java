package com.wcs.server.service;

import com.wcs.server.entity.Image;
import com.wcs.server.repository.ImageRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ImageService {

    private final ImageRepository imageRepository;


    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public Optional<Image> getImage(long id) {
        return imageRepository.findById(id);
    }


}