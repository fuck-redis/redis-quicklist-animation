import { getFromDb, setToDb } from '@/utils/indexedDb';

const STAR_CACHE_KEY = 'github-stars:fuck-redis/redis-quicklist-animation';
const STAR_CACHE_TTL_MS = 60 * 60 * 1000;

export interface RepoMeta {
  repoUrl: string;
  owner: string;
  name: string;
}

export const REPO_META: RepoMeta = {
  repoUrl: 'https://github.com/fuck-redis/redis-quicklist-animation',
  owner: 'fuck-redis',
  name: 'redis-quicklist-animation',
};

interface StarCacheValue {
  stars: number;
  fetchedAt: number;
}

export async function loadGithubStars(): Promise<number> {
  const cached = await getFromDb<StarCacheValue>(STAR_CACHE_KEY);
  if (cached?.value && Date.now() - cached.value.fetchedAt < STAR_CACHE_TTL_MS) {
    return cached.value.stars;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_META.owner}/${REPO_META.name}`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );

    if (!response.ok) {
      throw new Error(String(response.status));
    }

    const payload = (await response.json()) as { stargazers_count?: number };
    const stars = typeof payload.stargazers_count === 'number' ? payload.stargazers_count : 0;

    await setToDb(STAR_CACHE_KEY, { stars, fetchedAt: Date.now() } satisfies StarCacheValue);
    return stars;
  } catch {
    if (cached?.value) {
      return cached.value.stars;
    }
    return 0;
  }
}
