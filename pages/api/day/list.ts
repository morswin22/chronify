import { Day } from "@/app/dashboard/day";
import { db } from "@/lib/db";
import { withValidUserAPI } from "@/lib/session";
import { User } from "@/lib/user";

export default withValidUserAPI(async (req, res) => {
  const user = req.session.user as User;

  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

  const days = await db("days").where({ userId: user.id }).orderBy("startDate", "desc").limit(limit) as Day[];

  res.status(200).json(days);
});