package com.wcs.server.controller;

import com.wcs.server.entity.Image;
import com.wcs.server.entity.User;
import com.wcs.server.service.ImageService;
import com.wcs.server.service.UserService;
import com.wcs.server.utils.ImageCompressionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.zip.DataFormatException;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImageService imageService;
    @Autowired
    private UserService userService;
    @PostMapping
    public Image uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        Image image = new Image();
        image.setName(file.getOriginalFilename());

        byte[] compressedImage = ImageCompressionUtils.compress(file.getBytes());
        image.setImage(compressedImage);

        return imageService.saveImage(image);
    }

    @GetMapping("/{id}")
    public byte[] getImage(@PathVariable Long id) throws DataFormatException, IOException {
        byte[] compressedImage = imageService.getImage(id).get().getImage();
        return ImageCompressionUtils.decompress(compressedImage);
    }
}
