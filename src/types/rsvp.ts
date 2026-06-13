export type RsvpPayload = {
  name: string;
  attending: boolean;
  guestNames: string[];
  dietaryNotes: string;
};

export type RsvpRecord = RsvpPayload & {
  id: string;
  createdAt: string;
};
