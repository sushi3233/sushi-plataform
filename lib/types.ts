import type {
  Video,
  VideoThumbnail,
  Model,
  Category,
  Tag,
  VideoEmbed,
} from '@prisma/client';

export type VideoWithRelations = Video & {
  thumbnail: VideoThumbnail | null;
  models: Model[];
  categories: Category[];
  tags: Tag[];
  embed: VideoEmbed | null;
};

export type VideoWithUrl = Video & {
  thumbnail: VideoThumbnail | null;
  models: Model[];
};

export type VideoCardData = {
  slug: string;
  title: string;
  thumbnail?: string;
  duration: number;
  views: number;
  modelName?: string;
};

export type PaginationData = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};
