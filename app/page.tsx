import LandingPage from "@/app/landing";
import Navbar from "@/components/navbar";
import { getUser } from "@/components/userssr";
import DashboardPage from "@/app/dashboard";

export default async function HomePage() {
  const user = await getUser();

  return (
    <>
      <Navbar />
      <main>
        {user ? 
          <DashboardPage />
          :
          <LandingPage />
        }
      </main>
    </>
  )
}
