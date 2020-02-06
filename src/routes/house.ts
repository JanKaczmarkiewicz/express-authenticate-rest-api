import CRUDRoute, { Sanitizer } from "./template/crud";
import House, { IHouse } from "../Models/House";

type SanitizedObject = {
  id: string;
  number: IHouse["number"];
  creator: IHouse["creator"];
  createdAt: IHouse["createdAt"];
};
const sanitize: Sanitizer = ({
  _id,
  number,
  creator,
  createdAt
}: IHouse): SanitizedObject => ({
  id: _id,
  number,
  createdAt,
  creator
});

const router = CRUDRoute(House, sanitize);

export default router;
