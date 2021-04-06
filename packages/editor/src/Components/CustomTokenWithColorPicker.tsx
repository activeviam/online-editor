import React, { useEffect, useRef, useState } from "react";

import { Typography, Popover } from "@material-ui/core";
import { Color, SketchPicker } from "react-color";
import { CustomThemeProvider } from "../TokenizeTheme";

interface IProps {
  customThemeProvider: CustomThemeProvider;
  tokenName: string;
  id: number;
}

export const CustomTokenWithColorPicker = ({
  customThemeProvider,
  tokenName,
  id,
}: IProps) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const getColorCallback = (token: string) => {
    const color = customThemeProvider.getTokenColor(token);
    return color;
  };

  const initialColor = getColorCallback(tokenName);

  const [color, setColor] = useState<Color | undefined>(initialColor);

  const tokenCardRef = useRef<HTMLDivElement | null>(null);
  const colorPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target instanceof Element &&
        tokenCardRef.current &&
        !tokenCardRef.current.contains(event.target) &&
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target) &&
        isColorPickerOpen
      ) {
        setIsColorPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tokenCardRef, colorPickerRef, isColorPickerOpen, setIsColorPickerOpen]);

  return (
    <div className="token-info" key={id}>
      <li
        className="token-li"
        onClick={() => {
          setIsColorPickerOpen(true);
        }}
      >
        <Typography className="token-name">{`${tokenName} `}</Typography>
        <div
          ref={tokenCardRef}
          style={{
            background: "#" + getColorCallback(tokenName),
          }}
          className="rectangle"
        />
      </li>
      <Popover
        open={isColorPickerOpen}
        anchorEl={tokenCardRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div ref={colorPickerRef}>
          <SketchPicker
            color={color}
            onChange={(color) => {
              customThemeProvider.customizeColor(
                tokenName,
                color.hex.substring(1)
              );
              setColor(color.hex);
            }}
            onChangeComplete={(color) => {
              customThemeProvider.customizeColor(
                tokenName,
                color.hex.substring(1)
              );
              setColor(color.hex);
            }}
            disableAlpha
          />
        </div>
      </Popover>
    </div>
  );
};
