// export const getEvents = async () => {
//   const response = await fetch("http://127.0.0.1:8000/api/events");

//   if (!response.ok) {
//     throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
//   }

//   return await response.json();
// };


import { CALENDAR_ITENS_MOCK } from "@/modules/calendar/mocks";

export const getEvents = async () => {
  // TO DO: implement this
  // Increase the delay to better see the loading state
  // await new Promise(resolve => setTimeout(resolve, 800));
  return CALENDAR_ITENS_MOCK;
};