import express from "express";
import { register, login, me, activation } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";
import mediaMiddleware from "../middlewares/media.middleware";
import mediaController from "../controllers/media.controller";
import categoryController from "../controllers/category.controller";
import regionController from "../controllers/region.controller";
import eventController from "../controllers/event.controller";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", authMiddleware, me);
router.post("/auth/activate", activation);

router
  .route("/category")
  .post([authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.create)
  .get(categoryController.findAll);
router
  .route("/category/:id")
  .get(categoryController.findOne)
  .put([authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.update)
  .delete([authMiddleware, aclMiddleware([ROLES.ADMIN])], categoryController.remove);

router
  .route("/events/:id")
  .get(eventController.findOne)
  .put([authMiddleware, aclMiddleware([ROLES.ADMIN])], eventController.update)
  .delete([authMiddleware, aclMiddleware([ROLES.ADMIN])], eventController.remove);
router
  .route("/events")
  .get(eventController.findAll)
  .post([authMiddleware, aclMiddleware([ROLES.ADMIN])], eventController.create);
router.get("/events/:slug/slug", eventController.findOneBySlug);

router.get("/regions", regionController.getAllProvinces);
router.get("/regions/:id/province", regionController.getProvince);
router.get("/regions/:id/regency", regionController.getRegency);
router.get("/regions/:id/district", regionController.getDistrict);
router.get("/regions/:id/village", regionController.getVillage);
router.get("/regions-search", regionController.findByCity);

router.post("/media/upload-single", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]), mediaMiddleware.single("file")], mediaController.single);
router.post("/media/upload-multiple", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]), mediaMiddleware.multiple("files")], mediaController.multiple);
router.delete("/media/remove", [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])], mediaController.remove);

export default router;
