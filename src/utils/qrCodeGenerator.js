import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

export const generateUploadToken = () => {
  return uuidv4();
};

export const generateQRCode = async (
  uploadToken,
  baseUrl = window.location.origin
) => {
  const uploadUrl = `${baseUrl}/mobile-upload/${uploadToken}`;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(uploadUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
};
