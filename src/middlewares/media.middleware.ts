import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
});

const single = (fieldName: string) => upload.single(fieldName);
const multiple = (fieldName: string) => upload.array(fieldName);

export default { single, multiple };
