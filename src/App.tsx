import React, { useState } from "react";
import "./App.css";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import TabMenu from "./TabMenu/TabMenu";
import ConfigCanvas from "./ConfigCanvas/ConfigCanvas";
import { FontFamily } from "./AddTextTab/AddTextTab";

const App: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [text, setText] = useState<string>("");
  const [textSize, setTextSize] = useState<number>(14);
  const [textFont, setTextFont] = useState<FontFamily>(FontFamily.Arial);

  const handleImageUpload = (updateFn: (prevImages: File[]) => File[]) => {
    setImages((prevImages) => updateFn(prevImages));
  };

  const handleAddText = (text: string) => {
    setText(text);
  };

  const handleTextSize = (size: number) => {
    setTextSize(size);
  };

  const handleTextFont = (font: FontFamily) => {
    setTextFont(font);
  };

  return (
    <Grid display={"flex"} flexDirection={"column"} className="grid-container">
      <Typography
        fontSize={"48px"}
        textAlign={"center"}
        padding={"8px 0"}
        fontFamily={"GilroyExtraBold"}
      >
        T-SHIRTS DEMO
      </Typography>
      <Grid container display={"flex"} spacing={2} height={"calc(100vh - 148px)"}>
        <Grid item xs={5} maxHeight={"100%"}>
          <TabMenu
            text={text}
            handleAddText={handleAddText}
            handleTextSize={handleTextSize}
            handleTextFont={handleTextFont}
            images={images}
            textSize={textSize}
            textFont={textFont}
            handleImageUpload={handleImageUpload}
          />
        </Grid>

        <Grid item xs={7}>
          <ConfigCanvas images={images} text={text} textSize={textSize} textFont={textFont} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default App;
