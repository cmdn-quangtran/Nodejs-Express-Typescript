import { extension } from "mime-types";
import { dateToIsoString } from "./date-util";

export const mediaType = {
  FILE: "FILE",
  VIDEO: "VIDEO",
  IMAGE: "IMAGE",
  EMPTY: "",
};

export const mimetype = {
  PDF: "application/pdf",
  PNG: "image/png",
  JPEG: "image/jpeg",
  MP4: "video/mp4",
};

export const fileAllowList = [mimetype.PDF];
export const imageTypeAllowList = [mimetype.PNG, mimetype.JPEG];
export const videoTypeAllowList = [mimetype.MP4];

type Media = (typeof mediaType)[keyof typeof mediaType];

export const getType = (mimeType: string): Media => {
  if (extension(mimeType) === false) {
    return mediaType.EMPTY;
  }
  if (fileAllowList.includes(mimeType)) {
    return mediaType.FILE;
  }

  if (imageTypeAllowList.includes(mimeType)) {
    return mediaType.IMAGE;
  }

  if (videoTypeAllowList.includes(mimeType)) {
    return mediaType.VIDEO;
  }

  return mediaType.EMPTY;
};

export const getPath = ({
  id,
  messageType,
  isPreview,
  fileName,
}: {
  id: string;
  messageType: string;
  isPreview: boolean;
  fileName: string;
}): string => {
  const date = new Date();
  const dateString = dateToIsoString(date, "MMDDYYYY");
  return `${dateString}/${id}/${messageType.toLowerCase()}/${isPreview ? "preview" : "original"}/${fileName}`;
};
