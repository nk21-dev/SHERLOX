/**
 * Keyless utility to fetch authentic historical/event photos from Wikipedia.
 */
export async function fetchWikiImage(query: string): Promise<string | null> {
  try {
    const cleanQuery = query.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
    if (!cleanQuery) return null;

    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&pithumbsize=600&generator=search&gsrsearch=${encodeURIComponent(cleanQuery)}&gsrlimit=3`;
    
    const res = await fetch(url, { 
      headers: { 
        'User-Agent': 'SherloxDetective/1.0 (https://sherlox.archive; contact@sherlox.dev)' 
      },
      next: { revalidate: 3600 } // Cache images for 1 hour
    });

    if (!res.ok) return null;

    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;

    // Search for first result that provides an authentic thumbnail
    const pageList = Object.values(pages) as Array<{ thumbnail?: { source?: string } }>;
    for (const page of pageList) {
      if (page?.thumbnail?.source) {
        return page.thumbnail.source;
      }
    }

    return null;
  } catch {
    return null;
  }
}

