import { IreqUser } from "../utils/interface";
import { Response } from "express";
import uploader from "../utils/uploader";
import response from "../utils/response";

const single = async (req: IreqUser, res: Response) => {
  if (!req.file) {
    response.error(res, null, "file not found");
  }

  try {
    const result = await uploader.uploadSingle(req.file as Express.Multer.File);
    response.success(res, result, "success to upload the file");
  } catch {
    response.error(res, null, "failed to upload the file");
  }
};

const multiple = async (req: IreqUser, res: Response) => {
  if (!req.files || req.files.length === 0) {
    response.error(res, null, "file does not exist");
  }

  try {
    const result = await uploader.uploadMultiple(req.files as Express.Multer.File[]);

    response.success(res, result, "success uploading the files");
  } catch {
    response.error(res, null, "failed to upload the files");
  }
};

const remove = async (req: IreqUser, res: Response) => {
  try {
    const { fileUrl } = req.body as { fileUrl: string };
    const result = await uploader.remove(fileUrl);

    response.success(res, result, "success to remove the file");
  } catch {
    response.error(res, null, "failed to remove the file");
  }
};

export default { single, multiple, remove };
