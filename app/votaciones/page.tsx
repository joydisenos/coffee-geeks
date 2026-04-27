import { getActiveCafeteriasForVoting } from "@/app/actions/voting";
import VotacionesClient from "./VotacionesClient";

export const dynamic = "force-dynamic";

export default async function VotacionesPage() {
  const { round, cafeterias } = await getActiveCafeteriasForVoting();

  return (
    <VotacionesClient initialRound={round} initialCafeterias={cafeterias} />
  );
}
