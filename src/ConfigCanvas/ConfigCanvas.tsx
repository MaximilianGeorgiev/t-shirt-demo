import React, { useEffect, useRef, useState, useCallback } from "react";
import paper from "paper";
import Grid from "@mui/material/Grid";
import { Box, Button } from "@mui/material";
import "./ConfigCanvas.css";

interface ConfigCanvasProps {
  text: string;
  textFont?: string;
  textSize?: number;
  images?: File[];
}

interface BoundingBoxSize {
  width: number;
  height: number;
}

enum MouseEventTypes {
  Text = "text",
  Image = "image",
}

const OUTER_IMAGE_PATH = "images/outer-image.png";
const ROTATION_ANGLE = 15;
const SCALE_FACTOR = 1.1;
const BOUNDING_BOX_SIZE: BoundingBoxSize = { width: 250, height: 250 };
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const ConfigCanvas: React.FC<ConfigCanvasProps> = ({
  text,
  textFont = "Arial",
  textSize = 24,
  images = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const innerImageRef = useRef<paper.Raster | null>(null);
  const outerImageRef = useRef<paper.Raster | null>(null);
  const textRef = useRef<paper.PointText | null>(null);
  const boundingBoxRef = useRef<paper.Path.Rectangle | null>(null);

  const [selectedElement, setSelectedElement] = useState<"text" | "image" | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    paper.setup(canvas);

    const outerImage = new paper.Raster(OUTER_IMAGE_PATH);
    outerImage.position = paper.view.center;
    outerImage.scale(0.4);
    outerImage.sendToBack();
    outerImage.locked = true;
    outerImageRef.current = outerImage;

    const boundingBox = new paper.Path.Rectangle({
      point: [
        paper.view.center.x - BOUNDING_BOX_SIZE.width / 2,
        paper.view.center.y - BOUNDING_BOX_SIZE.height / 2,
      ],
      size: BOUNDING_BOX_SIZE,
      strokeColor: "red",
      dashArray: [10, 4],
      locked: true,
    });
    boundingBoxRef.current = boundingBox;

    return () => {
      outerImage.remove();
      boundingBox.remove();
      textRef.current?.remove();
      innerImageRef.current?.remove();
    };
  }, []);

  const handleDrag = useCallback((event: paper.MouseEvent, element: paper.Item) => {
    const newPosition = event.point;
    if (isWithinBoundingBox(newPosition, element)) {
      element.position = newPosition;
    }
  }, []);

  const setupMouseEvents = useCallback((element: paper.Item, type: MouseEventTypes) => {
    element.onMouseDown = () => setSelectedElement(type);
    element.onMouseDrag = (event: paper.MouseEvent) => handleDrag(event, element);
  }, [handleDrag]);

  const initializeText = useCallback(() => {
    textRef.current?.remove();

    const textElement = new paper.PointText({
      content: text,
      fillColor: "black",
      fontFamily: textFont,
      fontSize: textSize,
      position: paper.view.center,
    });
    setupMouseEvents(textElement, MouseEventTypes.Text);
    textRef.current = textElement;
  }, [setupMouseEvents, text, textFont, textSize]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!selectedElement) return;

    const element = selectedElement === "text" ? textRef.current : innerImageRef.current;
    const center = element?.bounds.center;

    if (!element || !center) return;

    if (selectedElement === "text") {
      handleTextTransform(event, center);
    } else if (selectedElement === "image") {
      handleImageTransform(event, center);
    }
  }, [selectedElement]);

  useEffect(() => {
    initializeText();
  }, [initializeText]);

  const initializeImage = useCallback(() => {
    if (!images.length) return;

    innerImageRef.current?.remove();
    const innerImage = new paper.Raster();
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        innerImage.source = event.target.result as string;
        innerImage.position = paper.view.center;
        innerImage.onLoad = () => {
          innerImage.bringToFront();
          setupMouseEvents(innerImage, MouseEventTypes.Image);
        };
        innerImageRef.current = innerImage;
      }
    };
    reader.readAsDataURL(images[0]);
  }, [images, setupMouseEvents]);

  useEffect(() => {
    initializeImage();
  }, [initializeImage]);

  const handleTextTransform = (event: KeyboardEvent, center: paper.Point) => {
    switch (event.key) {
      case "ArrowRight":
        textRef.current?.rotate(ROTATION_ANGLE, center);
        break;
      case "ArrowLeft":
        textRef.current?.rotate(-ROTATION_ANGLE, center);
        break;
      case "ArrowUp":
        if (textRef.current?.fontSize) {
          (textRef.current.fontSize as number) *= SCALE_FACTOR;
        }
        break;
      case "ArrowDown":
        if (textRef.current?.fontSize) {
          (textRef.current.fontSize as number) /= SCALE_FACTOR;
        }
        break;
      default:
        break;
    }
  };

  const handleImageTransform = (event: KeyboardEvent, center: paper.Point) => {
    switch (event.key) {
      case "ArrowRight":
        innerImageRef.current?.rotate(ROTATION_ANGLE, center);
        break;
      case "ArrowLeft":
        innerImageRef.current?.rotate(-ROTATION_ANGLE, center);
        break;
      case "ArrowUp":
        innerImageRef.current?.scale(SCALE_FACTOR);
        break;
      case "ArrowDown":
        innerImageRef.current?.scale(1 / SCALE_FACTOR);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, selectedElement]);

  const isWithinBoundingBox = (newPosition: paper.Point, element: paper.Item) => {
    const boundingBox = boundingBoxRef.current?.bounds;
    if (!boundingBox) return false;

    const { left, right, top, bottom } = boundingBox;
    const { width, height } = element.bounds;
    return (
      newPosition.x - width / 2 >= left &&
      newPosition.x + width / 2 <= right &&
      newPosition.y - height / 2 >= top &&
      newPosition.y + height / 2 <= bottom
    );
  };

  const exportAsPNG = () => {
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = BOUNDING_BOX_SIZE.width;
    exportCanvas.height = BOUNDING_BOX_SIZE.height;
    const exportContext = exportCanvas.getContext("2d");
    const boundingBoxTopLeft = boundingBoxRef.current!.bounds.topLeft;

    exportContext!.drawImage(
      canvasRef.current!,
      boundingBoxTopLeft.x,
      boundingBoxTopLeft.y,
      BOUNDING_BOX_SIZE.width,
      BOUNDING_BOX_SIZE.height,
      0,
      0,
      BOUNDING_BOX_SIZE.width,
      BOUNDING_BOX_SIZE.height
    );

    const link = document.createElement("a");
    link.download = "config-image.png";
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  const exportAsSVG = () => {
    const svgContent = paper.project.exportSVG({ asString: true }) as string;
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");

    const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    newSvg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    newSvg.setAttribute("width", BOUNDING_BOX_SIZE.width.toString());
    newSvg.setAttribute("height", BOUNDING_BOX_SIZE.height.toString());
    newSvg.setAttribute("viewBox", `0 0 ${BOUNDING_BOX_SIZE.width} ${BOUNDING_BOX_SIZE.height}`);

    const boundingBoxBounds = boundingBoxRef.current!.bounds;
    const offsetX = -boundingBoxBounds.x;
    const offsetY = -boundingBoxBounds.y;

    Array.from(svgDoc.documentElement.children).forEach((child) => {
      const clonedChild = child.cloneNode(true);
      if (clonedChild instanceof SVGGraphicsElement) {
        clonedChild.setAttribute("transform", `translate(${offsetX}, ${offsetY})`);
      }
      newSvg.appendChild(clonedChild);
    });

    const link = document.createElement("a");
    link.download = "config-image.svg";
    link.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(newSvg.outerHTML)}`;
    link.click();
  };

  return (
    <Box>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="config-canvas"
      />
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button className="button-export" variant="contained" color="primary" onClick={exportAsPNG}>
            Export as PNG
          </Button>
        </Grid>
        <Grid item>
          <Button className="button-export" variant="contained" color="primary" onClick={exportAsSVG}>
            Export as SVG
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConfigCanvas;
