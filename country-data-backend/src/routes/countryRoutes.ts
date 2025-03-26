import express from "express";
import {
  getCountries,
  filterCountriesByRegion,
  searchCountries,
  getCountryByCode,
} from "../controllers/countryController";

const router = express.Router();

router.get("/", getCountries);
router.get("/region/:region", filterCountriesByRegion);
router.get("/search", searchCountries);
router.get("/:code", getCountryByCode);

export default router;
