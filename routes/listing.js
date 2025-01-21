const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router.route("/")
      .get(wrapAsync(listingController.index))
      .post(validateListing,isLoggedIn,wrapAsync(listingController.createListing));

//New route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
      .get(wrapAsync(listingController.showListing))
      .put(validateListing,isLoggedIn,isOwner,wrapAsync(listingController.updateListing))
      .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;