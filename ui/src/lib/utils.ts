import React from "react";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BigNumberish, shortString } from "starknet";
import { TournamentPrize } from "@/generated/models.gen";
import { TOKEN_ADDRESSES, TOKEN_ICONS, ITEMS } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (Math.abs(num) >= 1000000) {
    return parseFloat((num / 1000000).toFixed(2)) + "m";
  } else if (Math.abs(num) >= 1000) {
    return parseFloat((num / 1000).toFixed(2)) + "k";
  } else if (Math.abs(num) >= 10) {
    return num.toFixed(0);
  } else if (Math.abs(num) > 0) {
    return num.toFixed(2);
  } else {
    return "0";
  }
}

export function formatEth(num: number): string {
  if (Math.abs(num) >= 0.01) {
    return num.toFixed(2);
  } else if (Math.abs(num) >= 0.0001) {
    return num.toFixed(4);
  } else {
    return "0";
  }
}

export function indexAddress(address: string) {
  return address.replace(/^0x0+/, "0x");
}

export function padAddress(address: string) {
  if (address && address !== "") {
    const length = address.length;
    const neededLength = 66 - length;
    let zeros = "";
    for (var i = 0; i < neededLength; i++) {
      zeros += "0";
    }
    const newHex = address.substring(0, 2) + zeros + address.substring(2);
    return newHex;
  } else {
    return "";
  }
}

export function displayAddress(string: string) {
  if (string === undefined) return "unknown";
  return string.substring(0, 6) + "..." + string.substring(string.length - 4);
}

export const stringToFelt = (v: string): BigNumberish =>
  v ? shortString.encodeShortString(v) : "0x0";

export const feltToString = (v: BigNumberish): string => {
  return BigInt(v) > 0n ? shortString.decodeShortString(bigintToHex(v)) : "";
};

export const bigintToHex = (v: BigNumberish): `0x${string}` =>
  !v ? "0x0" : `0x${BigInt(v).toString(16)}`;

export const isPositiveBigint = (v: BigNumberish | null): boolean => {
  try {
    return v != null && BigInt(v) > 0n;
  } catch {
    return false;
  }
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""}`;
  }
};

// Add a utility function to check if a date is before another date
export function isBefore(date1: Date, date2: Date) {
  return date1.getTime() < date2.getTime();
}

export function formatBalance(num: BigNumberish): number {
  return Number(num) / 10 ** 18;
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};

export const removeFieldOrder = <T extends Record<string, any>>(
  obj: T
): Omit<T, "fieldOrder"> => {
  const newObj = { ...obj } as Record<string, any>; // Cast to a non-generic type
  delete newObj.fieldOrder;

  Object.keys(newObj).forEach((key) => {
    if (typeof newObj[key] === "object" && newObj[key] !== null) {
      newObj[key] = removeFieldOrder(newObj[key]);
    }
  });

  return newObj as Omit<T, "fieldOrder">;
};

export const cleanObject = (obj: any): any =>
  Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {} as { [key: string]: any });

export const calculatePayouts = (
  totalPlaces: number,
  weightingFactor: number
): number[] => {
  // Calculate the weights for each place
  const weights: number[] = [];
  for (let i = 1; i <= totalPlaces; i++) {
    weights.push(1 / Math.pow(i, weightingFactor));
  }

  // Calculate the total weight
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  // Calculate the percentage payouts
  const payouts: number[] = weights.map((weight) =>
    Math.floor((weight / totalWeight) * 100)
  );

  // Calculate the sum of rounded payouts
  const totalPayout = payouts.reduce((sum, payout) => sum + payout, 0);

  // Distribute the remaining percentage points
  // to the highest weighted positions until we reach 100
  let remaining = 100 - totalPayout;
  let index = 0;
  while (remaining > 0) {
    payouts[index] += 1;
    remaining -= 1;
    index = (index + 1) % totalPlaces;
  }

  return payouts;
};

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function getItemKeyFromValue(searchValue: string): string | null {
  const entry = Object.entries(ITEMS).find(
    ([_key, value]) => value === searchValue
  );
  return entry ? entry[0] : null;
}

export function getTokenKeyFromValue(searchValue: string): string | null {
  const entry = Object.entries(TOKEN_ADDRESSES).find(
    ([_key, value]) => value === searchValue
  );
  return entry ? entry[0] : null;
}

export function getItemValueFromKey(key: number): string | null {
  return ITEMS[key];
}

export const getPrizesByToken = (prizes: TournamentPrize[]) => {
  return Object.entries(
    prizes.reduce((acc, prize) => {
      const key = prize.token;
      if (!acc[key]) acc[key] = [];
      acc[key].push(prize);
      return acc;
    }, {} as Record<string, typeof prizes>)
  );
};

export const getTokenNameOrIcon = (
  namespace: string,
  token: string,
  tokens: any[]
) => {
  return TOKEN_ICONS[getTokenKeyFromValue(token)!]
    ? React.createElement(TOKEN_ICONS[getTokenKeyFromValue(token)!])
    : tokens.find((t) => t.models[namespace].Token?.token === token)?.models[
        namespace
      ].Token?.symbol;
};

export const getOrdinalSuffix = (position: number) => {
  const formatPosition = isNaN(position) ? 0 : position;
  if (formatPosition % 10 === 1 && formatPosition !== 11) return "st";
  if (formatPosition % 10 === 2 && formatPosition !== 12) return "nd";
  if (position % 10 === 3 && position !== 13) return "rd";
  return "th";
};
