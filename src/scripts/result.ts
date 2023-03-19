import { numRequest } from "./index";
import {
  calendarYears,
  houseSalesAndPrices as housePriceVariables,
  propertyType as propertyTypeVariables,
  buildStatus as buildStatusVariables,
} from "./dimensions";
import { countries, regions, counties, places } from "./geography";

const cardContainer = document.querySelector(
  "#card__container"
) as HTMLDivElement;

// Types
interface monthResult {
  order: number;
  month: string;
  observation: string;
}
interface finalResult {
  geography: string;
  time: string;
  houseSalesAndPrices: string;
  propertyType: string;
  buildStatus: string;
  observations: monthResult[];
}

export const formatResult = (result: any) => {
  const { dimensions, observations } = result;
  console.log("dimensions:", dimensions);
  console.log("obv:", observations);
  const finalResult: finalResult = {
    geography: dimensions.geography.option.id,
    time: dimensions.time.option.id,
    houseSalesAndPrices: dimensions.housesalesandprices.option.id,
    propertyType: dimensions.propertytype.option.id,
    buildStatus: dimensions.buildstatus.option.id,
    observations: [],
  };

  for (const obs of observations) {
    if (obs.observation.length > 0) {
      switch (obs.dimensions.Month.id) {
        case "mar":
          const mar: monthResult = {
            order: 0,
            month: "Mar",
            observation: obs.observation,
          };
          finalResult.observations.push(mar);
          break;
        case "jun":
          const jun: monthResult = {
            order: 1,
            month: "Jun",
            observation: obs.observation,
          };
          finalResult.observations.push(jun);
          break;
        case "sep":
          const sep: monthResult = {
            order: 2,
            month: "Sep",
            observation: obs.observation,
          };
          finalResult.observations.push(sep);
          break;
        case "dec":
          const dec: monthResult = {
            order: 3,
            month: "Dec",
            observation: obs.observation,
          };
          finalResult.observations.push(dec);
          break;
        default:
          console.log("Can't find this month");
      }
    }
  }

  // Sort the months
  sortMonths(finalResult.observations);
  return finalResult;
};

export const printFinalResult = (finalResult: finalResult) => {
  const {
    geography,
    time,
    houseSalesAndPrices,
    propertyType,
    buildStatus,
    observations,
  } = finalResult;

  // Create a col for Bootstrap grid system
  const cardCol = document.createElement("div");
  cardCol.setAttribute("class", "col");

  if (numRequest === 0) {
    cardContainer.appendChild(cardCol);
  } else {
    cardContainer.insertBefore(cardCol, cardContainer.firstChild);
    if (numRequest > 6 && cardContainer.lastChild) {
      cardContainer.removeChild(cardContainer.lastChild);
    }
  }

  // Create a card of result
  const card = document.createElement("div");
  card.setAttribute("class", "card border-dark");
  cardCol.appendChild(card);

  // Create number of request as card header
  const cardHeader = document.createElement("div");
  cardHeader.setAttribute("class", "card-header");
  cardHeader.innerText = `Result #${numRequest} `;
  card.appendChild(cardHeader);

  // Create card body
  const cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");
  card.appendChild(cardBody);

  // Create card title
  const cardTitle = document.createElement("h3");
  cardTitle.setAttribute("class", "card-title");
  cardBody.appendChild(cardTitle);

  // Create a table for result
  const table = document.createElement("table");
  table.setAttribute("class", "table table-hover");
  cardBody.appendChild(table);

  // Create table header
  const tableHeader = document.createElement("thead");
  table.appendChild(tableHeader);
  const trHeader = document.createElement("tr");
  tableHeader.appendChild(trHeader);

  // Create "Time" as left column header
  const th1 = document.createElement("th");
  th1.setAttribute("scope", "col");
  th1.innerText = "Time";
  trHeader.appendChild(th1);

  // Create "House price variable" as right column header
  const th2 = document.createElement("th");
  th2.setAttribute("scope", "col");

  for (const housePriceVariable of housePriceVariables) {
    if (housePriceVariable.code === houseSalesAndPrices) {
      th2.innerText = housePriceVariable.label;
    }
  }
  trHeader.appendChild(th2);

  // Create table body
  const tableBody = document.createElement("tbody");
  table.appendChild(tableBody);

  observations.forEach((obs) => {
    const tr = document.createElement("tr");
    tableBody.appendChild(tr);

    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.innerText = `${obs.month} ${time}`;
    tr.appendChild(th);

    const td = document.createElement("td");
    if (houseSalesAndPrices === "sales") {
      td.innerText = `${parseInt(obs.observation).toLocaleString()}`;
    } else {
      td.innerText = `£ ${parseInt(obs.observation).toLocaleString()}`;
    }
    tr.appendChild(td);
  });

  // Indicate property type
  const cardText1 = document.createElement("p");
  cardText1.setAttribute("class", "card-text");

  for (const propertyTypeVariable of propertyTypeVariables) {
    if (propertyTypeVariable.code === propertyType) {
      cardText1.innerHTML = `<strong>Property type:</strong> ${propertyTypeVariable.label}`;
    }
  }
  cardBody.appendChild(cardText1);

  // Indicate build status
  const cardText2 = document.createElement("p");
  cardText2.setAttribute("class", "card-text");
  for (const buildStatusVariable of buildStatusVariables) {
    if (buildStatusVariable.code === buildStatus) {
      cardText2.innerHTML = `<strong>Property status:</strong> ${buildStatusVariable.label}`;
    }
  }
  cardBody.appendChild(cardText2);

  // Create card footer
  const cardFooter = document.createElement("div");
  cardFooter.setAttribute("class", "card-footer");
  card.appendChild(cardFooter);

  // Insert address to card footer
  const address = document.createElement("a");
  address.setAttribute("class", "card-link");
  address.setAttribute(
    "href",
    `http://statistics.data.gov.uk/atlas/resource?uri=http://statistics.data.gov.uk/id/statistical-geography/${geography}`
  );
  address.setAttribute("target", "_blank");
  cardFooter.appendChild(address);

  // Filling the place name and address
  for (const place of places) {
    const { code, label, county, region, country } = place;
    if (code === geography) {
      cardTitle.innerText = label;

      if (county.length > 0) {
        address.append(`${county}, `);
      }
      if (region.length > 0) {
        address.append(`${region}, `);
      }
      address.append(country);
    }
  }

  // Create badge
  if (numRequest > 1) {
    const existingBadge = document.querySelector(
      "#new-badge"
    ) as HTMLSpanElement;
    if (existingBadge) {
      existingBadge.remove();
    }
    const newBadge = document.createElement("span");
    newBadge.setAttribute("class", "badge bg-primary");
    newBadge.setAttribute("id", "new-badge");
    newBadge.innerText = "New";
    cardHeader.append(newBadge);
  }

  // Scroll to result
  cardContainer.scrollIntoView({ behavior: "smooth" });
};

const sortMonths = (arr: monthResult[]) => {
  arr.sort(function (a, b) {
    var monthA = a.order;
    var monthB = b.order;
    if (monthA < monthB) {
      return -1;
    }
    if (monthA > monthB) {
      return 1;
    }
    return 0;
  });
};
