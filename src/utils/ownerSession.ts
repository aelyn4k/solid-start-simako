import { users } from "~/data/dummyData";

export const ownerSessionEmailKey = "simako-session-email";
export const defaultOwnerId = 2;

export const getCurrentOwner = () => {
  if (typeof localStorage === "undefined") {
    return users.find((user) => user.id === defaultOwnerId);
  }

  const sessionEmail = localStorage
    .getItem(ownerSessionEmailKey)
    ?.trim()
    .toLowerCase();

  return (
    users.find(
      (user) =>
        user.role === "pemilik_kost" &&
        user.email.toLowerCase() === sessionEmail,
    ) ?? users.find((user) => user.id === defaultOwnerId)
  );
};

export const getCurrentOwnerId = () => getCurrentOwner()?.id ?? defaultOwnerId;
