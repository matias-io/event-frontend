import { Buffer } from "buffer"; // Ensure Buffer is available for encoding/decoding

type RoomDetails = {
  cost: number;
  epoch: number;
  name: string;
};

// Base62 encoding to ensure compact representation within felt 252 limits
const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const encodeBase62 = (num: bigint): string => {
  let encoded = "";
  while (num > 0) {
    encoded = base62Chars[Number(num % 62n)] + encoded;
    num = num / 62n;
  }
  return encoded || "0"; // Ensure we return '0' if the number is 0
};

const decodeBase62 = (str: string): bigint => {
  let decoded = 0n;
  for (let i = 0; i < str.length; i++) {
    decoded = decoded * 62n + BigInt(base62Chars.indexOf(str[i]));
  }
  return decoded;
};

// Encoding the room details into a BigInt, making sure we stay within the felt 252 size
export const encodeRoomDetails = ({ cost, epoch, name }: RoomDetails): bigint => {
  const costDigits = 4; // Reserve 4 digits for cost
  const epochDigits = 10; // Reserve 10 digits for epoch (UNIX time)

  // Ensure the cost and epoch are padded to the correct lengths
  const paddedCost = String(cost).padStart(costDigits, "0");
  const paddedEpoch = String(epoch).padStart(epochDigits, "0");

  // Convert the name into a compact representation that fits within the limits
  const nameEncoded = Buffer.from(name, "utf-8").toString("base64"); // Base64 encoding the name
  const maxNameLength = 254 - (costDigits + epochDigits); // Make sure name length doesn't exceed the limit
  const nameTrimmed = nameEncoded.slice(0, maxNameLength);

  // Concatenate all parts (cost, epoch, and name) into a single string
  const encodedString = paddedCost + paddedEpoch + nameTrimmed;

  // Convert the concatenated string to a BigInt using Base62 encoding
  const encodedBigInt = decodeBase62(encodedString);

  return encodedBigInt;
};

// Decoding the BigInt back into room details
export const decodeRoomDetails = (bigInt: bigint): RoomDetails => {
  // Convert the BigInt to a Base62 string
  const decodedString = encodeBase62(bigInt);

  const costDigits = 4;
  const epochDigits = 10;

  // Extract cost, epoch, and name from the decoded string
  const cost = Number(decodedString.slice(0, costDigits));
  const epoch = Number(decodedString.slice(costDigits, costDigits + epochDigits));
  const name = Buffer.from(decodedString.slice(costDigits + epochDigits), "base64").toString("utf-8");

  return { cost, epoch, name };
};
