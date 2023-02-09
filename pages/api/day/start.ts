import { Day } from "@/app/dashboard/day";
import { db } from "@/lib/db";
import { withValidUserAPI } from "@/lib/session";
import { User } from "@/lib/user";

export default withValidUserAPI(async (req, res) => {
  const user = req.session.user as User;

  const lastDay = await db("days").where({ userId: user.id }).orderBy("startDate", "desc").first() as Day | undefined;

  if (lastDay && lastDay.endDate === null) {
    res.status(400).json({ error: "You already have an active day." });
    return;
  }

  const [ newDay ] = await db("days").insert({ userId: user.id }).returning("*") as Day[];
  res.status(200).json(newDay);
});