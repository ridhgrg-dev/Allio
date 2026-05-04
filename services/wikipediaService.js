const WIKIPEDIA_SEARCH_URL = 'https://en.wikipedia.org/w/rest.php/v1/search/page';

export async function searchWikipedia(query) {
  const trimmed = query.trim();

  if (!trimmed) {
    throw new Error('Enter a topic to search.');
  }

  try {
    const response = await fetch(`${WIKIPEDIA_SEARCH_URL}?q=${encodeURIComponent(trimmed)}&limit=5`);

    if (!response.ok) {
      throw new Error('Wikipedia search is unavailable right now.');
    }

    const data = await response.json();

    return (data.pages || []).map((page) => ({
      id: page.id,
      title: page.title,
      summary: page.excerpt?.replace(/<[^>]+>/g, '') || 'No summary available.',
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.key)}`,
    }));
  } catch (err) {
    throw new Error('Wikipedia search is unavailable right now.');
  }
}
