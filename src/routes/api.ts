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
import ticketController from "../controllers/ticket.controller";
import bannerController from "../controllers/banner.controller";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", authMiddleware, me);
router.post("/auth/activate", activation);

router
  .route("/banners")
  .get(
    bannerController.findAll
    /*
    #swagger.tags = ['Banners']
    */
  )
  .post(
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    bannerController.create
    /*
    #swagger.tags = ['Banners']
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateBannerRequest"
      }
    }
    */
  );
router
  .route("/banners/:id")
  .get(
    bannerController.findOne /*
    #swagger.tags = ['Banners']
    */
  )
  .put(
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    bannerController.update
    /*
    #swagger.tags = ['Banners']
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateBannerRequest"
      }
    }
    */
  )
  .delete(
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    bannerController.remove
    /*
    #swagger.tags = ['Banners']
    #swagger.security = [{ "bearerAuth": {} }]
    */
  );

router
  .route("/tickets")
  .get(
    ticketController.findAll
    /*
    #swagger.tags = ['Tickets']
    */
  )
  .post(
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    ticketController.create
    /*
    #swagger.tags = ['Tickets']
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateTicketRequest"
      }
    }
    */
  );
router
  .route("/tickets/:id")
  .get(
    ticketController.findOne
    /*
    #swagger.tags = ['Tickets']
    */
  )
  .put(
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    ticketController.update
    /*
    #swagger.tags = ['Tickets']
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateTicketRequest"
      }
    }
    */
  )
  .delete(
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    ticketController.remove
    /*
    #swagger.tags = ['Tickets']
    #swagger.security = [{ "bearerAuth": {} }]
    */
  );
router.get(
  "/tickets/:eventId/events",
  ticketController.findAllByEvent
  /*
  #swagger.tags = ['Tickets']
  */
);

router
  .route("/category")
  .post(
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    categoryController.create
    /*
    #swagger.tags = ['Category']
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateCategoryRequest"
      }
    }
    */
  )
  .get(
    categoryController.findAll
    /*
    #swagger.tags = ['Category']
    */
  );
router
  .route("/category/:id")
  .get(
    categoryController.findOne
    /*
    #swagger.tags = ['Category']
    */
  )
  .put(
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    categoryController.update
    /*
      #swagger.tags = ['Category']
      #swagger.security = [{ "bearerAuth": {} }]
      #swagger.requestBody = {
        required: true,
        schema: {
          $ref: "#/components/schemas/CreateCategoryRequest"
        }
      }
      */
  )
  .delete(
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    categoryController.remove
    /*
    #swagger.tags = ['Category']
    #swagger.security = [{ "bearerAuth": {} }]
    */
  );

router
  .route("/events/:id")
  .get(
    eventController.findOne
    /*
    #swagger.tags = ['Events']
    */
  )
  .put(
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    eventController.update
    /*
    #swagger.tags = ['Events']
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateEventRequest"
      }
    }
    */
  )
  .delete(
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    eventController.remove
    /*
    #swagger.tags = ['Events']
    #swagger.security = [{ "bearerAuth": {} }]
    */
  );
router
  .route("/events")
  .get(
    eventController.findAll
    /*
    #swagger.tags = ['Events']
    */
  )
  .post(
    [authMiddleware, aclMiddleware([ROLES.ADMIN])],
    eventController.create
    /*
    #swagger.tags = ['Events']
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: "#/components/schemas/CreateEventRequest"
      }
    }
    */
  );
router.get(
  "/events/:slug/slug",
  eventController.findOneBySlug
  /*
  #swagger.tags = ['Events']
  */
);

router.get(
  "/regions",
  regionController.getAllProvinces
  /*
  #swagger.tags = ['Regions']
  */
);
router.get(
  "/regions/:id/province",
  regionController.getProvince
  /*
  #swagger.tags = ['Regions']
  */
);
router.get(
  "/regions/:id/regency",
  regionController.getRegency
  /*
  #swagger.tags = ['Regions']
  */
);
router.get(
  "/regions/:id/district",
  regionController.getDistrict
  /*
  #swagger.tags = ['Regions']
  */
);
router.get(
  "/regions/:id/village",
  regionController.getVillage
  /*
  #swagger.tags = ['Regions']
  */
);
router.get(
  "/regions-search",
  regionController.findByCity
  /*
  #swagger.tags = ['Regions']
  */
);

router.post(
  "/media/upload-single",
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]), mediaMiddleware.single("file")],
  mediaController.single
  /*
  #swagger.tags = ['Media']
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            file: {
              type: "string",
              format: "binary"
            }
          }
        }
      }
    }
  }
  */
);
router.post(
  "/media/upload-multiple",
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]), mediaMiddleware.multiple("files")],
  mediaController.multiple
  /*
  #swagger.tags = ['Media']
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            files: {
              type: "array",
              items: {
                type: "string",
                format: "binary"
              }
            }
          }
        }
      }
    }
  }
  */
);
router.delete(
  "/media/remove",
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])],
  mediaController.remove
  /*
  #swagger.tags = ['Media']
  #swagger.security = [{ "bearerAuth": {} }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/RemoveMediaRequest"  
    }
  }
  */
);

export default router;
