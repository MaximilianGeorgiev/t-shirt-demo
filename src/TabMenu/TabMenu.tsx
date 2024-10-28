import React from "react";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AddImageTab from "../AddImageTab/AddImageTab";
import AddTextTab from "../AddTextTab/AddTextTab";
import { FontFamily } from "../AddTextTab/AddTextTab"; 
import "./TabMenu.css";

interface TabMenuProps {
  images: File[];
  handleImageUpload: (updateFn: (prevImages: File[]) => File[]) => void;
  text: string;
  textSize: number;
  textFont: FontFamily; 
  handleAddText: (text: string) => void;
  handleTextFont: (font: FontFamily) => void; 
  handleTextSize: (size: number) => void;
}

interface TabContainerProps {
  children: React.ReactNode;
  value: number;
  index: number;
  dir?: "ltr" | "rtl";
  className?: string;
}

const TabContainer: React.FC<TabContainerProps> = ({
  children,
  value,
  index,
  dir = "ltr",
  className,
  ...other
}) => (
  <Typography
    component="div"
    role="tabpanel"
    hidden={value !== index}
    id={`action-tabpanel-${index}`}
    aria-labelledby={`action-tab-${index}`}
    className={className}
    {...other}
  >
    {value === index && <Box className="tab-container-box">{children}</Box>}
  </Typography>
);

const TabMenu: React.FC<TabMenuProps> = ({
  images,
  handleImageUpload,
  text,
  textFont,
  textSize,
  handleAddText,
  handleTextFont,
  handleTextSize,
}) => {
  const theme = useTheme();
  const [value, setValue] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid width="100%" height="100%" className="tabs-wrapper">
      <AppBar position="static" color="default" className="tabs-appbar">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="action tabs example"
          className="tabs-nav"
        >
          <Tab className="tabs-nav" label="Artclips" id="action-tab-1" />
          <Tab className="tabs-nav" label="Text Editor" id="action-tab-2" />
        </Tabs>
      </AppBar>
      <TabContainer value={value} index={0} dir={theme.direction} className="tabs-panel">
        <AddImageTab images={images} handleImageUpload={handleImageUpload} />
      </TabContainer>
      <TabContainer value={value} index={1} dir={theme.direction} className="tabs-panel">
        <AddTextTab
          text={text}
          textSize={textSize}
          textFont={textFont}
          handleAddText={handleAddText}
          handleTextFont={handleTextFont}
          handleTextSize={handleTextSize}
        />
      </TabContainer>
    </Grid>
  );
};

export default TabMenu;
