import { IreqUser } from "../utils/interface";
import { Response } from "express";
import uploader from "../utils/uploader";

const single = async (req: IreqUser, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      data: null,
      message: "file does not exist",
    });
  }

  try {
    const result = await uploader.uploadSingle(req.file as Express.Multer.File);
    res.status(200).json({
      data: result,
      message: "success uploading the file",
    });
  } catch {
    res.status(500).json({
      data: null,
      message: "failed to upload the file",
    });
  }
};

const multiple = async (req: IreqUser, res: Response) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      data: null,
      message: "file does not exist",
    });
  }

  try {
    const result = await uploader.uploadMultiple(req.files as Express.Multer.File[]);
    res.status(200).json({
      data: result,
      message: "success uploading the files",
    });
  } catch {
    res.status(500).json({
      data: null,
      message: "failed to upload the files",
    });
  }
};

const remove = async (req: IreqUser, res: Response) => {
  try {
    const { fileUrl } = req.body as { fileUrl: string };
    const result = await uploader.remove(fileUrl);

    res.status(200).json({
      data: result,
      message: "success to remove the file",
    });
  } catch {
    res.status(500).json({
      data: null,
      message: "failed to remove the file",
    });
  }
};

export default { single, multiple, remove };
