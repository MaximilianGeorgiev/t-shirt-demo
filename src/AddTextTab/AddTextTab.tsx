import React from "react";
import { Typography, Box, TextField, MenuItem, Select, FormControl, Grid } from "@mui/material";
import "./AddTextTab.css";

export enum FontFamily {
  Arial = "Arial",
  Verdana = "Verdana",
  Tahoma = "Tahoma",
  CourierNew = "Courier New",
  Georgia = "Georgia",
  TimesNewRoman = "Times New Roman",
  Roboto = "Roboto",
  Montserrat = "Montserrat",
  Lobster = "Lobster",
}

const fontFamilies = Object.values(FontFamily);

interface AddTextTabProps {
  text: string;
  textFont: FontFamily;
  textSize: number;
  handleAddText: (value: string) => void;
  handleTextFont: (value: FontFamily) => void;
  handleTextSize: (value: number) => void;
}

const AddTextTab: React.FC<AddTextTabProps> = ({
  text,
  textSize,
  textFont,
  handleAddText,
  handleTextFont,
  handleTextSize,
}) => (
  <Box>
    <Typography marginBottom="24px" color="#3674cc" fontFamily="GilroyExtraBold" fontSize="32px">
      TEXT EDITOR
    </Typography>

    <Grid container spacing={2} direction="column">
      <Grid item>
        <Typography gutterBottom fontFamily="GilroyBold" fontSize="28px">
          Add New Text
        </Typography>
        <Typography gutterBottom fontFamily="GilroyRegular" fontSize="18px">
          You can select multiple fonts and set a precise size.
        </Typography>
      </Grid>

      <Grid container gap="36px" flexDirection="column" marginTop="42px">
        <Grid item>
          <p className="tab-heading">Text Content</p>
          <TextField
            className="text-field"
            fullWidth
            value={text}
            onChange={(e) => handleAddText(e.target.value)}
            variant="outlined"
          />
        </Grid>

        <Grid container item spacing={2} alignItems="center">
          <Grid item xs={8}>
            <p className="tab-heading">Font Family</p>
            <FormControl fullWidth>
              <Select
                className="select-field"
                value={textFont}
                onChange={(e) => handleTextFont(e.target.value as FontFamily)}
              >
                {fontFamilies.map((font) => (
                  <MenuItem key={font} value={font}>
                    {font}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <p className="tab-heading">Font Size</p>
            <TextField
              className="text-field"
              type="number"
              value={textSize}
              onChange={(e) => handleTextSize(Number(e.target.value))}
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>

      {text && (
        <Grid container marginTop="24px">
          <Grid item>
            <Typography
              style={{
                fontFamily: textFont,
                fontSize: `${textSize}px`,
              }}
            >
              {text}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Grid>
  </Box>
);

export default AddTextTab;
