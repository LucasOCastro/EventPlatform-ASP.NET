import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

declare module "dayjs" {
  interface Dayjs extends dayjs.Dayjs {
    utc(): Dayjs;
  }
}

console.log("dayjs setup completed");
