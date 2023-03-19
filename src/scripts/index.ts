import axios from "axios";
import _ from "lodash";

import { countryMenu, regionMenu, submitButton, resetButton } from "./menus";
import {
  searchTerm,
  createYearArray,
  createAllMenus,
  toggleCountry,
  updatePlaceMenu,
  checkOptions,
} from "./menus";
import { formatResult, printFinalResult } from "./result";
import { printSuccess, printError, clearAlerts } from "./utils";

const API = "https://api.beta.ons.gov.uk/v1";

export let numRequest = 0;

// Types
interface versionInfo {
  nextRelease: string;
  releaseDate: string;
  releaseFrequency: string;
  version: string;
  versionLink: string;
}

const connectAPI = async (): Promise<boolean> => {
  try {
    // Make a GET request to dataset
    const firstRes = await axios.get(
      `${API}/datasets/house-prices-local-authority`
    );

    // Make a GET request to the latest version
    const secondRes = await axios.get(firstRes.data.links.latest_version.href);

    // Collect the latest version's info for printing out on webpage

    const versionInfo: versionInfo = {
      nextRelease: firstRes.data.next_release,
      releaseDate: new Date(secondRes.data.release_date).toDateString(),
      releaseFrequency: firstRes.data.release_frequency,
      version: secondRes.data.version,
      versionLink: firstRes.data.links.latest_version.href,
    };
    printVersionInfo(versionInfo);

    // Extract the current year from ISO date format, e.g. 2022-09-14T00:00:00.000Z
    const currentYear: string = secondRes.data.release_date.slice(0, 4);
    createYearArray(currentYear);

    // Connected to API successfully
    return true;
  } catch (err) {
    // Failed to connect to API
    console.log("connectAPI - ERROR", err);
    return false;
  }
};

const printVersionInfo = (info: versionInfo): void => {
  const { nextRelease, releaseDate, releaseFrequency, version, versionLink } =
    info;
  document.querySelector("#release-date")!.append(` ${releaseDate}`);
  document.querySelector("#next-release")!.append(` ${nextRelease}`);
  document.querySelector("#release-frequency")!.append(` ${releaseFrequency}`);
  document.querySelector(
    "#version"
  )!.innerHTML = ` <a href="${versionLink}" target="_blank">${version}</a>`;
};

const startApp = async () => {
  const APIStatus = await connectAPI();

  // Print alert of the API connection status
  if (APIStatus === true) {
    printSuccess();
  } else if (APIStatus === false) {
    printError();
  }

  // Create dropdown menus
  createAllMenus();
};

startApp();

countryMenu.addEventListener("change", toggleCountry);
regionMenu.addEventListener("change", updatePlaceMenu);

// Get result
submitButton.addEventListener("click", async (e) => {
  e.preventDefault;

  // Check if all options are selected
  const searchTerm = checkOptions();

  // Check if there is a searchTerm returned
  if (searchTerm) {
    const resultData = await getResult(searchTerm);

    numRequest += 1;
    const finalResult = formatResult(resultData);
    printFinalResult(finalResult);
    resetButton();
    clearAlerts();
  }
});

const getResult = async (searchTerm: searchTerm) => {
  try {
    const res = await axios.get(`${API}/datasets/house-prices-local-authority`);
    const latestVersionLink = res.data.links.latest_version.href;
    const result = await axios.get(
      `${latestVersionLink}/observations`,
      searchTerm
    );
    return result.data;
  } catch (err) {
    console.log("getResult - ERR0R", err);
    printError();
  }
};
