import {User} from "../../user/model/User.model";

export interface Itinerary {
  id?: string;
  name: string;
  description?: string;
  beginDate: Date;
  endDate?: Date;
  user: User;
}
