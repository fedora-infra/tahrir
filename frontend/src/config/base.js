import { createTheme } from "@mui/material";

export const scheme = createTheme({
  colorSchemes: {
    dark: true,
  },
  typography: {
    fontSize: 14,
    fontFamily: [
      '"Inter"',
      'sans-serif',
    ].join(','),
  },
});

export const flawText = [
  "Flat tyre - You should be walking",
  "How about we explore the area ahead of us later?",
  "This is surely not what you were looking for",
  "I swear it was supposed to be here",
  "Segmentation fault - Core dumped",
  "Redirecting to SourceForge - Just kidding",
  "It is okay to get lost every now and then",
  "Even the things we love break sometimes",
  "Try refreshing and see if you find it?",
  "We looked everywhere - Even under the couch",
];
