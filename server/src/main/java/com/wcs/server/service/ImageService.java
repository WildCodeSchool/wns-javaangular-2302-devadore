package com.wcs.server.service;

import com.wcs.server.entity.Image;
import com.wcs.server.entity.User;
import com.wcs.server.repository.ImageRepository;
import com.wcs.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserRepository userRepository;
    public Image saveImage(Image image) {
        return imageRepository.save(image);
    }

    public Optional<Image> getImage(long id) {
        return imageRepository.findById(id);
    }

    public List<Image> getImagesForUser(Long userId) {
        return imageRepository.findByUserId(userId);
    }
    public Image uploadImageForUser(MultipartFile file, Long userId) throws IOException {
        User user = userRepository.getOne(userId); // Or however you retrieve users

        Image image = new Image();
        image.setName(file.getOriginalFilename());
        image.setImage(file.getBytes());
        image.setUser(user);

        return imageRepository.save(image);
    }

}