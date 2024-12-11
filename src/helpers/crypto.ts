import CryptoJS from "crypto-js";

export const decryptFromEnv = (key: string) => {
  if (process.env.SECRET) {
    var bytesToKey = CryptoJS.AES.decrypt(key, process.env.SECRET);
    return bytesToKey.toString(CryptoJS.enc.Utf8);
  } else {
    throw new Error("env variable SECRET not set");
  }
};
