import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  }).onUploadComplete(() => console.log("uploaded")),
  productColorImage: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  }).onUploadComplete(() => console.log("uploaded")),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
