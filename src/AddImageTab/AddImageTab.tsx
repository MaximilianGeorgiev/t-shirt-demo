import React from "react";
import { Button, Typography, IconButton, Grid } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import "./AddImageTab.css";

interface AddImageTabProps {
  images: File[];
  handleImageUpload: (updateFn: (previousImages: File[]) => File[]) => void;
}

const AddImageTab: React.FC<AddImageTabProps> = ({ images, handleImageUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleImageUpload((previousImages) => previousImages.concat(files));
  };

  const handleRemoveImage = (image: File) => {
    handleImageUpload((previousImages) => previousImages.filter((currentImage) => currentImage !== image));
  };

  return (
    <Grid>
      <Typography marginBottom={"24px"} color={"#3674cc"} fontFamily={"GilroyExtraBold"} fontSize={"32px"}>
        ARTCLIPS
      </Typography>

      <Grid>
        <Typography gutterBottom fontFamily={"GilroyBold"} fontSize={"28px"}>
          Upload Images
        </Typography>
        <Typography gutterBottom fontFamily={"GilroyRegular"} fontSize={"18px"}>
          Our design professionals will select ink colors for you or tell us your preferred colors with Design Notes.
        </Typography>

        <input accept="image/*" style={{ display: "none" }} id="upload-button" multiple type="file" onChange={handleFileChange} />

        <label htmlFor="upload-button">
          <Button className={"button-upload"} component="span" startIcon={<UploadFileIcon className="upload-icon" />}>
            Upload
          </Button>
        </label>
      </Grid>

      {images.length > 0 && (
        <Typography gutterBottom fontFamily={"GilroyBold"} fontSize={"20px"} marginTop={"32px"}>
          Already uploaded Images
        </Typography>
      )}

      <Grid container gap={"12px"} marginTop={"4px"}>
        {images.map((image, index) => (
          <Grid item xs={4} key={index} className="image-grid-item">
            <img src={URL.createObjectURL(image)} alt={`uploaded-${index}`} className="image" />
            <Grid className="grid-item" />
            <IconButton onClick={() => handleRemoveImage(image)} className="remove-image-icon">
              &times;
            </IconButton>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default AddImageTab;
