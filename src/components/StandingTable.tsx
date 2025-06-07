import * as React from "react";
import { useEffect, useState } from "react";

// Komponen Table dari shadcn/ui
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const API_URL = "https://v3.football.api-sports.io/standings?league=2&season=2023";
const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY || ""; // Pastikan API key di .env

const getBadge = (pos: number) => {
  if (pos === 1) return <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-400 border-2 border-black text-xs font-bold shadow-[2px_2px_0_#000] whitespace-nowrap">Champion</span>;
  if (pos === 2) return <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-300 border-2 border-black text-xs font-bold shadow-[2px_2px_0_#000] whitespace-nowrap">Runner-up</span>;
  if (pos === 3) return <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-400 border-2 border-black text-xs font-bold shadow-[2px_2px_0_#000] whitespace-nowrap">Third</span>;
  return null;
};

const StandingTable: React.FC = () => {
  const [standings, setStandings] = useState<any[][]>([]);
  const [league, setLeague] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_URL, {
          method: "GET",
          headers: {
            "x-apisports-key": API_KEY,
          },
        });
        const data = await res.json();
        // Ambil data standings dan info liga
        const leagueData = data.response[0]?.league;
        setLeague(leagueData);
        setStandings(leagueData?.standings || []);
      } catch (err) {
        console.log("Error fetching standings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStandings();
  }, []);

  return (
    <div
      className="max-w-3xl mx-auto mt-8 sm:mt-12 p-2 sm:p-8 rounded-2xl sm:rounded-3xl border-4 border-black bg-yellow-200 shadow-[6px_6px_0_0_#000] sm:shadow-[10px_10px_0_0_#000]"
      style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
    >
      {league && (
        <div className="flex items-center justify-center mb-4 gap-3">
          <img src={league.logo} alt={league.name} className="w-10 h-10 sm:w-14 sm:h-14 border-2 border-black bg-white rounded-xl shadow-[2px_2px_0_#000]" />
          <h2 className="text-xl sm:text-3xl font-extrabold text-black tracking-tight drop-shadow-[2px_2px_0_#fff] text-center">
            <span className="px-2 py-1 sm:px-4 sm:py-2 bg-pink-500 border-4 border-black rounded-xl sm:rounded-2xl shadow-[2px_2px_0_0_#000] sm:shadow-[4px_4px_0_0_#000]">{league.name} Standings</span>
          </h2>
        </div>
      )}
      {loading ? (
        <div className="text-center py-8 font-bold text-lg">Loading...</div>
      ) : (
        <div className="flex flex-col gap-8">
          {standings.map((group, groupIdx) => (
            <div key={groupIdx}>
              {group[0]?.group && standings.length > 1 && (
                <div className="mb-2 text-center">
                  <span className="inline-block px-3 py-1 bg-blue-200 border-2 border-black rounded-lg font-bold text-blue-900 shadow-[2px_2px_0_#000]">{group[0].group}</span>
                </div>
              )}
              <div className="overflow-x-auto">
                <Table className="w-full border-separate border-spacing-0 min-w-[400px] sm:min-w-0">
                  <TableHeader>
                    <TableRow className="bg-blue-500 text-white border-b-4 border-black rounded-xl">
                      <TableHead className="font-bold text-xs sm:text-base border-r-4 border-black text-center py-2 sm:py-4 rounded-tl-xl">Pos</TableHead>
                      <TableHead className="font-bold text-xs sm:text-base border-r-4 border-black text-center">Team</TableHead>
                      <TableHead className="font-bold text-xs sm:text-base border-r-4 border-black text-center">P</TableHead>
                      <TableHead className="font-bold text-xs sm:text-base border-r-4 border-black text-center">W</TableHead>
                      <TableHead className="font-bold text-xs sm:text-base border-r-4 border-black text-center">D</TableHead>
                      <TableHead className="font-bold text-xs sm:text-base border-r-4 border-black text-center">L</TableHead>
                      <TableHead className="font-bold text-xs sm:text-base border-r-4 border-black text-center hidden md:table-cell">GF</TableHead>
                      <TableHead className="font-bold text-xs sm:text-base border-r-4 border-black text-center hidden md:table-cell">GA</TableHead>
                      <TableHead className="font-bold text-xs sm:text-base border-r-4 border-black text-center hidden md:table-cell">GD</TableHead>
                      <TableHead className="font-bold text-xs sm:text-base text-center rounded-tr-xl">Pts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.map((team: any, idx: number) => (
                      <TableRow
                        key={team.team.id}
                        className={`border-b-4 border-black ${idx % 2 === 0 ? 'bg-white' : 'bg-pink-100'} hover:bg-green-200 transition-colors duration-200 rounded-xl shadow-[2px_2px_0_0_#000] sm:shadow-[4px_4px_0_0_#000]`}
                        style={{ transition: 'box-shadow 0.2s, background 0.2s' }}
                      >
                        <TableCell className="font-extrabold text-black border-r-4 border-black text-center text-base sm:text-lg py-2 sm:py-3">
                          {team.rank}
                          {getBadge(team.rank)}
                        </TableCell>
                        <TableCell className="font-bold text-black border-r-4 border-black text-base sm:text-lg py-2 sm:py-3">
                          <div className="flex items-center gap-2">
                            <img src={team.team.logo} alt={team.team.name} className="w-6 h-6 sm:w-8 sm:h-8 border border-black bg-white rounded shadow-[1px_1px_0_#000]" />
                            <span>{team.team.name}</span>
                          </div>
                          <div className="block md:hidden text-xs text-gray-500 mt-1">
                            <span className="mr-2">GF: {team.all.goals.for}</span>
                            <span className="mr-2">GA: {team.all.goals.against}</span>
                            <span>GD: {team.goalsDiff}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-black border-r-4 border-black text-center py-2 sm:py-3">{team.all.played}</TableCell>
                        <TableCell className="font-bold text-black border-r-4 border-black text-center py-2 sm:py-3">{team.all.win}</TableCell>
                        <TableCell className="font-bold text-black border-r-4 border-black text-center py-2 sm:py-3">{team.all.draw}</TableCell>
                        <TableCell className="font-bold text-black border-r-4 border-black text-center py-2 sm:py-3">{team.all.lose}</TableCell>
                        <TableCell className="font-bold text-black border-r-4 border-black text-center py-2 sm:py-3 hidden md:table-cell">{team.all.goals.for}</TableCell>
                        <TableCell className="font-bold text-black border-r-4 border-black text-center py-2 sm:py-3 hidden md:table-cell">{team.all.goals.against}</TableCell>
                        <TableCell className="font-bold text-black border-r-4 border-black text-center py-2 sm:py-3 hidden md:table-cell">{team.goalsDiff}</TableCell>
                        <TableCell className="font-extrabold text-pink-600 text-center text-base sm:text-lg py-2 sm:py-3">{team.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StandingTable; 