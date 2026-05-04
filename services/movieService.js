const mockMovies = [
  {
    id: 'arrival',
    title: 'Arrival',
    year: '2016',
    rating: 'PG-13',
    description: 'A linguist helps decode an alien language after mysterious spacecraft arrive around the world.',
  },
  {
    id: 'severance',
    title: 'Severance',
    year: '2022',
    rating: 'TV-MA',
    description: 'Office workers split their work and personal memories, then begin to uncover the system around them.',
  },
  {
    id: 'the-martian',
    title: 'The Martian',
    year: '2015',
    rating: 'PG-13',
    description: 'An astronaut stranded on Mars uses science, grit, and a lot of potatoes to survive.',
  },
  {
    id: 'station-eleven',
    title: 'Station Eleven',
    year: '2021',
    rating: 'TV-MA',
    description: 'A limited series following artists and survivors rebuilding meaning after a global collapse.',
  },
];

export async function searchMovies(query) {
  const trimmed = query.trim().toLowerCase();

  if (!trimmed) {
    throw new Error('Enter a movie or show title.');
  }

  // Future integration point: replace this filter with TMDB/OMDb results and
  // keep the returned object shape stable for the UI.
  return mockMovies.filter((item) => {
    return (
      item.title.toLowerCase().includes(trimmed) ||
      item.description.toLowerCase().includes(trimmed)
    );
  });
}
