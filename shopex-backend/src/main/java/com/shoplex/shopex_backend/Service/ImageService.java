package com.shoplex.shopex_backend.Service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;


@Service
public class ImageService {
    private Cloudinary cloudinary;

    public ImageService() {
        cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "dfbbkoru4",
            "api_key", "254537928382317",
            "api_secret", "MFhH2opvklNSmSzG-XH-zEVoG8w"));
                        }
   public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return uploadResult.get("url").toString();  // Get uploaded image URL
    }
    public String deleteImage(String url){
        String publicId = url.substring(url.lastIndexOf("/")+1, url.lastIndexOf("."));
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "Image deleted successfully";
        } catch (IOException e) {
            e.printStackTrace();
            return "Error deleting image";
        }
    }
}
