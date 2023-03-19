import { countries, regions, counties, places } from "./geography";
import {
  dimension,
  calendarYears,
  houseSalesAndPrices,
  propertyType,
  buildStatus,
} from "./dimensions";
import { printReminder } from "./utils";

// Select each menu
export const countryMenu = document.querySelector(
  "#countries"
) as HTMLSelectElement;
export const regionMenu = document.querySelector(
  "#regions"
) as HTMLSelectElement;
export const placeMenu = document.querySelector("#places") as HTMLSelectElement;
export const yearMenu = document.querySelector(
  "#calendar-years"
) as HTMLSelectElement;
export const housePriceVariableMenu = document.querySelector(
  "#house-sales-and-prices"
) as HTMLSelectElement;
export const propertyTypeMenu = document.querySelector(
  "#property-type"
) as HTMLSelectElement;
export const buildStatusMenu = document.querySelector(
  "#build-status"
) as HTMLSelectElement;

// Select the submit button
export const submitButton = document.querySelector(
  "#submit-button"
) as HTMLButtonElement;

// Create the array of calendar year
export const createYearArray = (currentYear: string) => {
  for (let i = Number(currentYear); i > 2014; i--) {
    const year: dimension = {
      code: `${i}`,
      label: `${i}`,
    };
    calendarYears.push(year);
  }
};

// Sort the place names
export const sortPlaceNames = () => {
  places.sort(function (a, b) {
    var nameA = a.label.toUpperCase(); // ignore upper and lowercase
    var nameB = b.label.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
};

// Create all dropdown menus, except the one for places
export const createAllMenus = (): void => {
  createMenu(countries, "#countries");
  createMenu(regions, "#regions");
  createMenu(calendarYears, "#calendar-years");
  createMenu(houseSalesAndPrices, "#house-sales-and-prices");
  createMenu(propertyType, "#property-type");
  createMenu(buildStatus, "#build-status");
  sortPlaceNames();
};

// Create single menu
const createMenu = (dimension: dimension[], id: string): void => {
  const targetMenu = document.querySelector(id) as HTMLSelectElement;
  for (const optionObj of dimension) {
    const { code, label } = optionObj;
    const option = document.createElement("option");
    option.setAttribute("value", code);
    option.innerText = label;
    targetMenu.append(option);
  }
};

// When toggle between England and Wales
export const toggleCountry = () => {
  // Hide region and place menu
  regionMenu.parentElement?.classList.add("is-hidden");
  placeMenu.parentElement?.classList.add("is-hidden");

  // Clear up all options of place menu
  placeMenu.innerHTML = "";

  if (countryMenu.value === "england") {
    console.log("selected england");
    regionMenu.parentElement?.classList.remove("is-hidden");
  } else if (countryMenu.value === "wales") {
    regionMenu.parentElement?.classList.add("is-hidden");
    placeMenu.parentElement?.classList.remove("is-hidden");
    // Create the first option as placeholder
    const placeholderOption = document.createElement("option");
    placeholderOption.innerText = "Choose an option";
    placeholderOption.setAttribute("value", "");
    placeMenu.appendChild(placeholderOption);

    for (const place of places) {
      if (place.country === "Wales") {
        const option = document.createElement("option");
        option.innerText = place.label;
        option.setAttribute("value", place.code);
        placeMenu.appendChild(option);
      }
    }
  }
};

export const updatePlaceMenu = () => {
  // Clear up all options of place menu
  placeMenu.innerHTML = "";
  if (regionMenu.value.length > 0) {
    placeMenu.parentElement?.classList.remove("is-hidden");
  } else {
    placeMenu.parentElement?.classList.add("is-hidden");
  }

  // Create the first option as placeholder
  const placeholderOption = document.createElement("option");
  placeholderOption.innerText = "Choose an option";
  placeholderOption.setAttribute("value", "");
  placeMenu.appendChild(placeholderOption);

  // Create the first option group: Unitary Authorities
  const optgroupUnitaryAuthorities = document.createElement("optgroup");
  optgroupUnitaryAuthorities.setAttribute("label", counties[0].label);
  optgroupUnitaryAuthorities.setAttribute("id", counties[0].code);
  placeMenu.appendChild(optgroupUnitaryAuthorities);

  // Create the option groups
  for (const region of regions) {
    if (region.code === regionMenu.value) {
      // Create counties as option groups
      for (const county of counties) {
        if (county.region === region.label) {
          const optgroup = document.createElement("optgroup");
          optgroup.setAttribute("label", county.label);
          optgroup.setAttribute("id", county.code);
          placeMenu.appendChild(optgroup);
        }
      }

      // Create places as options
      for (const place of places) {
        if (place.region === region.label) {
          let targetOptgroup;

          if (place.county.length > 0) {
            for (const county of counties) {
              if (place.county === county.label) {
                targetOptgroup = document.querySelector(
                  `#${county.code}`
                ) as HTMLOptGroupElement;
              }
            }
          } else {
            targetOptgroup = document.querySelector(
              "#unitary-authorities"
            ) as HTMLOptGroupElement;
          }

          const option = document.createElement("option");
          option.innerText = place.label;
          option.setAttribute("value", place.code);
          if (targetOptgroup) {
            targetOptgroup.appendChild(option);
          }
        }
      }
    }
  }
};

export interface searchTerm {
  params: {
    time: string;
    month: "*";
    geography: string;
    housesalesandprices: string;
    propertytype: string;
    buildstatus: string;
  };
}

// Check whether all required options are selected
export const checkOptions = () => {
  if (
    placeMenu.value.length > 0 &&
    yearMenu.value.length > 0 &&
    housePriceVariableMenu.value.length > 0 &&
    propertyTypeMenu.value.length > 0 &&
    buildStatusMenu.value.length > 0
  ) {
    const searchTerm: searchTerm = {
      params: {
        time: yearMenu.value,
        month: "*",
        geography: placeMenu.value,
        housesalesandprices: housePriceVariableMenu.value,
        propertytype: propertyTypeMenu.value,
        buildstatus: buildStatusMenu.value,
      },
    };
    console.log("all selected");
    disableButton();

    return searchTerm;
  } else {
    console.log("not all selected");
    printReminder();
  }
};

const disableButton = () => {
  submitButton.setAttribute("disabled", "");
  submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
};

export const resetButton = () => {
  submitButton.removeAttribute("disabled");
  submitButton.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Search`;
};
