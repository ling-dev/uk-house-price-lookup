// Types
export interface dimension {
  code: string;
  label: string;
}

//The year in which the 12-month time period ends
export const calendarYears: dimension[] = [];

//Summary statistics including median, mean, count, lower quartile and tenth-percentile
export const houseSalesAndPrices: dimension[] = [
  { code: "sales", label: "Count of sales" },
  { code: "lower-quartile", label: "Lower quartile price" },
  { code: "mean", label: "Mean price" },
  { code: "median", label: "Median price" },
  { code: "tenth-percentile", label: "Tenth percentile price" },
];

// Type of property transacted: detached, semi-detached, terraced and flats and maisonettes
export const propertyType: dimension[] = [
  { code: "all", label: "All" },
  { code: "detached", label: "Detached" },
  { code: "flat-maisonette", label: "Flat/maisonette" },
  { code: "semi-detached", label: "Semi-detached" },
  { code: "terraced", label: "Terraced" },
];

// Type of property transacted: newly-built property or an existing property
export const buildStatus: dimension[] = [
  { code: "all", label: "All" },
  { code: "existing", label: "Existing" },
  { code: "newly-built", label: "Newly built" },
];
