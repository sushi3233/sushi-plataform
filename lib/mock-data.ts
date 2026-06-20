import type { VideoCardData, VideoWithRelations } from './types';

export const MOCK_VIDEOS: VideoCardData[] = [
  {
    slug: 'novinha-gostosa-dando-no-quarto',
    title: 'Novinha gostosa dando no quarto do motel',
    thumbnail: 'https://picsum.photos/seed/video1/640/360',
    duration: 845,
    views: 152340,
    modelName: 'Maria Silva',
  },
  {
    slug: 'casal-amador-brasileiro',
    title: 'Casal amador brasileiro fazendo amor',
    thumbnail: 'https://picsum.photos/seed/video2/640/360',
    duration: 1203,
    views: 89420,
    modelName: 'Ana Costa',
  },
  {
    slug: 'morena-gostosa-suruba',
    title: 'Morena gostosa em suruba com amigos',
    thumbnail: 'https://picsum.photos/seed/video3/640/360',
    duration: 1567,
    views: 234500,
    modelName: 'Julia Santos',
  },
  {
    slug: 'loira-rabuda-de-quatro',
    title: 'Loira rabuda de quatro no sofá',
    thumbnail: 'https://picsum.photos/seed/video4/640/360',
    duration: 678,
    views: 67890,
    modelName: 'Carla Oliveira',
  },
  {
    slug: 'ruiva-gemendo-alto',
    title: 'Ruiva gemendo alto na cama',
    thumbnail: 'https://picsum.photos/seed/video5/640/360',
    duration: 934,
    views: 145200,
    modelName: 'Fernanda Lima',
  },
  {
    slug: 'coroa-safada-seduzindo',
    title: 'Coroa safada seduzindo o vizinho',
    thumbnail: 'https://picsum.photos/seed/video6/640/360',
    duration: 1120,
    views: 78430,
    modelName: 'Patricia Souza',
  },
  {
    slug: 'estudante-novinha-webcam',
    title: 'Estudante novinha se exibindo na webcam',
    thumbnail: 'https://picsum.photos/seed/video7/640/360',
    duration: 567,
    views: 312000,
    modelName: 'Bruna Alves',
  },
  {
    slug: 'casada-traindo-marido',
    title: 'Casada traindo o marido com amante',
    thumbnail: 'https://picsum.photos/seed/video8/640/360',
    duration: 1890,
    views: 189400,
    modelName: 'Camila Ferreira',
  },
  {
    slug: 'morena-bunduda-anal',
    title: 'Morena bunduda fazendo anal gostoso',
    thumbnail: 'https://picsum.photos/seed/video9/640/360',
    duration: 1345,
    views: 267800,
    modelName: 'Leticia Rocha',
  },
  {
    slug: 'duas-amigas-lesbicas',
    title: 'Duas amigas lésbicas se pegando',
    thumbnail: 'https://picsum.photos/seed/video10/640/360',
    duration: 1023,
    views: 198700,
    modelName: 'Amanda e Bianca',
  },
  {
    slug: 'novinha-primeira-vez',
    title: 'Novinha na primeira vez com namorado',
    thumbnail: 'https://picsum.photos/seed/video11/640/360',
    duration: 756,
    views: 423000,
    modelName: 'Isabela Martins',
  },
  {
    slug: 'gostosa-fitness-academia',
    title: 'Gostosa fitness transando na academia',
    thumbnail: 'https://picsum.photos/seed/video12/640/360',
    duration: 1567,
    views: 156300,
    modelName: 'Rafaela Gomes',
  },
  {
    slug: 'secretaria-safada-escritorio',
    title: 'Secretária safada dando no escritório',
    thumbnail: 'https://picsum.photos/seed/video13/640/360',
    duration: 890,
    views: 134500,
    modelName: 'Vanessa Dias',
  },
  {
    slug: 'ninfeta-boquete-profissional',
    title: 'Ninfeta fazendo boquete profissional',
    thumbnail: 'https://picsum.photos/seed/video14/640/360',
    duration: 645,
    views: 287600,
    modelName: 'Larissa Mendes',
  },
  {
    slug: 'casal-swing-festa',
    title: 'Casal no swing em festa privada',
    thumbnail: 'https://picsum.photos/seed/video15/640/360',
    duration: 2134,
    views: 98700,
    modelName: 'Vários',
  },
  {
    slug: 'empregada-domestica-seducao',
    title: 'Empregada doméstica seduzindo patrão',
    thumbnail: 'https://picsum.photos/seed/video16/640/360',
    duration: 1234,
    views: 176400,
    modelName: 'Rosa Maria',
  },
  {
    slug: 'prima-gostosa-escondido',
    title: 'Prima gostosa transando escondido',
    thumbnail: 'https://picsum.photos/seed/video17/640/360',
    duration: 987,
    views: 345600,
    modelName: 'Anônima',
  },
  {
    slug: 'massagista-final-feliz',
    title: 'Massagista oferecendo final feliz',
    thumbnail: 'https://picsum.photos/seed/video18/640/360',
    duration: 1456,
    views: 112300,
    modelName: 'Tainá Silva',
  },
  {
    slug: 'vizinha-gostosa-janela',
    title: 'Vizinha gostosa flagrada pela janela',
    thumbnail: 'https://picsum.photos/seed/video19/640/360',
    duration: 534,
    views: 234100,
    modelName: 'Desconhecida',
  },
  {
    slug: 'morena-peituda-titjob',
    title: 'Morena peituda fazendo titjob gostoso',
    thumbnail: 'https://picsum.photos/seed/video20/640/360',
    duration: 867,
    views: 187900,
    modelName: 'Carolina Prado',
  },
];

export const MOCK_CATEGORIES = [
  { name: 'Amador', slug: 'amador', count: 234 },
  { name: 'Brasileiro', slug: 'brasileiro', count: 567 },
  { name: 'Novinha', slug: 'novinha', count: 345 },
  { name: 'Casada', slug: 'casada', count: 189 },
  { name: 'Anal', slug: 'anal', count: 278 },
  { name: 'Lésbicas', slug: 'lesbicas', count: 156 },
  { name: 'Coroa', slug: 'coroa', count: 123 },
  { name: 'Loira', slug: 'loira', count: 234 },
  { name: 'Morena', slug: 'morena', count: 456 },
  { name: 'Ruiva', slug: 'ruiva', count: 89 },
];

export const MOCK_MODELS = [
  { name: 'Maria Silva', slug: 'maria-silva', videoCount: 23 },
  { name: 'Ana Costa', slug: 'ana-costa', videoCount: 18 },
  { name: 'Julia Santos', slug: 'julia-santos', videoCount: 31 },
  { name: 'Carla Oliveira', slug: 'carla-oliveira', videoCount: 15 },
  { name: 'Fernanda Lima', slug: 'fernanda-lima', videoCount: 27 },
];

export const MOCK_TAGS = [
  { name: 'Gostosa', slug: 'gostosa' },
  { name: 'Bunduda', slug: 'bunduda' },
  { name: 'Peituda', slug: 'peituda' },
  { name: 'Safada', slug: 'safada' },
  { name: 'Gemendo', slug: 'gemendo' },
  { name: 'Oral', slug: 'oral' },
  { name: 'Hardcore', slug: 'hardcore' },
  { name: 'Softcore', slug: 'softcore' },
];

export function getMockVideoWithRelations(slug: string): VideoWithRelations | null {
  const video = MOCK_VIDEOS.find((v) => v.slug === slug);
  if (!video) return null;

  return {
    id: `mock-${slug}`,
    slug: video.slug,
    metaTitle: video.title,
    metaDescription: `Assista ${video.title} em HD grátis. Os melhores vídeos pornô brasileiros você encontra aqui.`,
    h1Title: video.title,
    duration: video.duration,
    views: video.views,
    status: 'PUBLISHED',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-20'),
    publishedAt: new Date('2024-01-16'),
    embed: {
      id: `embed-${slug}`,
      videoId: `mock-${slug}`,
      hlsUrl: 'https://test-streams.mux.dev/x36xhzz/playlist.m3u8',
      iframeUrl: '',
      sourcePlatform: 'vazounudes',
      sourceId: 'mock-source-id',
      sourceUrl: null,
      originalPosterUrl: video.thumbnail,
      createdAt: new Date(),
    },
    thumbnail: {
      id: `thumb-${slug}`,
      videoId: `mock-${slug}`,
      url: video.thumbnail || '',
      r2Key: `thumbnails/${slug}/cover.webp`,
      altText: video.title,
      createdAt: new Date(),
    },
    models: [
      {
        id: 'model-1',
        name: video.modelName || 'Modelo Anônima',
        slug: video.modelName?.toLowerCase().replace(/\s+/g, '-') || 'anonima',
        imageUrl: null,
        createdAt: new Date('2024-01-01'),
      },
    ],
    categories: [
      { id: 'cat-1', name: 'Brasileiro', slug: 'brasileiro', createdAt: new Date() },
      { id: 'cat-2', name: 'Amador', slug: 'amador', createdAt: new Date() },
    ],
    tags: [
      { id: 'tag-1', name: 'Gostosa', slug: 'gostosa', createdAt: new Date() },
      { id: 'tag-2', name: 'HD', slug: 'hd', createdAt: new Date() },
      { id: 'tag-3', name: 'Nacional', slug: 'nacional', createdAt: new Date() },
    ],
    dailyViews: [],
  } as VideoWithRelations;
}

export function getMockVideosPaginated(page: number, perPage: number = 20): {
  videos: VideoCardData[];
  total: number;
} {

  const allVideos = [...MOCK_VIDEOS, ...MOCK_VIDEOS, ...MOCK_VIDEOS];
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    videos: allVideos.slice(start, end),
    total: allVideos.length,
  };
}

export function searchMockVideos(query: string): VideoCardData[] {
  const lowerQuery = query.toLowerCase();
  return MOCK_VIDEOS.filter(
    (v) =>
      v.title.toLowerCase().includes(lowerQuery) ||
      v.modelName?.toLowerCase().includes(lowerQuery)
  );
}

export function getMockVideosByModel(modelSlug: string, page: number = 1, perPage: number = 20): {
  videos: VideoCardData[];
  total: number;
  model: { name: string; slug: string; videoCount: number } | null;
} {
  const model = MOCK_MODELS.find((m) => m.slug === modelSlug);
  if (!model) {
    return { videos: [], total: 0, model: null };
  }

  const modelVideos = MOCK_VIDEOS.filter(
    (v) => v.modelName?.toLowerCase().replace(/\s+/g, '-') === modelSlug
  );

  const allVideos = [...modelVideos, ...modelVideos, ...modelVideos];
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    videos: allVideos.slice(start, end),
    total: allVideos.length,
    model,
  };
}

export function getMockVideosByCategory(categorySlug: string, page: number = 1, perPage: number = 20): {
  videos: VideoCardData[];
  total: number;
  category: { name: string; slug: string; count: number } | null;
} {
  const category = MOCK_CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) {
    return { videos: [], total: 0, category: null };
  }

  const allVideos = [...MOCK_VIDEOS, ...MOCK_VIDEOS];
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    videos: allVideos.slice(start, end),
    total: allVideos.length,
    category,
  };
}

export function getMockVideosByTag(tagSlug: string, page: number = 1, perPage: number = 20): {
  videos: VideoCardData[];
  total: number;
  tag: { name: string; slug: string } | null;
} {
  const tag = MOCK_TAGS.find((t) => t.slug === tagSlug);
  if (!tag) {
    return { videos: [], total: 0, tag: null };
  }

  const allVideos = [...MOCK_VIDEOS, ...MOCK_VIDEOS];
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    videos: allVideos.slice(start, end),
    total: allVideos.length,
    tag,
  };
}

export function getMockRecentVideos(page: number = 1, perPage: number = 20): {
  videos: VideoCardData[];
  total: number;
} {

  const allVideos = [...MOCK_VIDEOS, ...MOCK_VIDEOS, ...MOCK_VIDEOS];
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    videos: allVideos.slice(start, end),
    total: allVideos.length,
  };
}

export function getMockMostViewedVideos(page: number = 1, perPage: number = 20): {
  videos: VideoCardData[];
  total: number;
} {
  const allVideos = [...MOCK_VIDEOS, ...MOCK_VIDEOS, ...MOCK_VIDEOS].sort(
    (a, b) => b.views - a.views
  );
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    videos: allVideos.slice(start, end),
    total: allVideos.length,
  };
}

export function getMockTrendingVideos(page: number = 1, perPage: number = 20): {
  videos: VideoCardData[];
  total: number;
} {

  const allVideos = [...MOCK_VIDEOS, ...MOCK_VIDEOS].sort((a, b) => b.views - a.views);
  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    videos: allVideos.slice(start, end),
    total: allVideos.length,
  };
}

export function getAllMockCategories() {
  return MOCK_CATEGORIES;
}

export function getAllMockTags() {
  return MOCK_TAGS;
}

export function getAllMockModels() {
  return MOCK_MODELS;
}
