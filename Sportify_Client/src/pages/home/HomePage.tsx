import { useEffect, useState } from "react";
import SectionGrid from "./components/SectionGrid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useStatStore } from "@/stores/useStatStore";
import { Song, User } from "@/utils/types";
import ArtistsSection from "./components/sections/ArtistsSection";
import FeaturedSection from "./components/sections/FeaturedSection";

const HomePage = () => {
  const { getFeaturedSongs, getMadeForYouSongs, getTrendingSongs, isLoading } =
    useMusicStore();
  const { getTopArtistsStat } = useStatStore();

  const { initializeQueue } = usePlayerStore();

  const [madeForYouSongs, setMadeForYouSongs] = useState<Song[]>([]);
  const [featuredSongs, setFeaturedSongs] = useState<Song[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [topArtists, setTopArtists] = useState<User[]>([]);
  const [greeting, setGreeting] = useState("");

  // Call API when component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const featured = await getFeaturedSongs();
        const madeForYou = await getMadeForYouSongs();
        const trending = await getTrendingSongs();
        const artists = await getTopArtistsStat();

        setFeaturedSongs(featured);
        setMadeForYouSongs(madeForYou);
        setTrendingSongs(trending);
        setTopArtists(artists);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchData();
  }, [
    getFeaturedSongs,
    getMadeForYouSongs,
    getTrendingSongs,
    getTopArtistsStat,
  ]);

  // Initialize the queue when has data
  useEffect(() => {
    if (
      madeForYouSongs.length > 0 &&
      featuredSongs.length > 0 &&
      trendingSongs.length > 0
    ) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        setGreeting("Morning");
      } else if (currentHour < 18) {
        setGreeting("Afternoon");
      } else {
        setGreeting("Evening");
      }
    };

    updateGreeting();
  }, []);

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Good {greeting}
          </h1>

          <FeaturedSection />

          <div className="space-y-8">
            <ArtistsSection artists={topArtists} isLoading={isLoading} />

            <SectionGrid
              title="Made For You"
              songs={madeForYouSongs}
              isLoading={isLoading}
            />

            <SectionGrid
              title="Trending"
              songs={trendingSongs}
              isLoading={isLoading}
            />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;
