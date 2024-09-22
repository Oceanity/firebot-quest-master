type ModIOSearchResult<T> = {
  data: Array<T>;
  result_count: number;
  result_offset: number;
  result_limit: number;
  result_total: number;
}

type ModIOMod = {
  id: number;
  game_id: number;
  status: number;
  visible: number;
  submitted_by: ModIOUser;
  date_added: number;
  date_updated: number;
  date_live: number;
  maturity_option: number;
  community_options: number;
  monetization_options: number;
  stock: number;
  price: number;
  tax: number;
  logo: ModIOImages<{ thumb_320x180: string, thumb_640x360: string, thumb_1280x720: string }>;
  homepage_url: null;
  name: string;
  name_id: string;
  summary: string;
  description: string;
  description_plaintext: string;
  metadata_blob: null;
  profile_url: string;
  media: {
    youtube: Array<unknown>;
    sketchfab: Array<unknown>;
    images: Array<unknown>;
  };
  modfile: {
    id: number;
    mod_id: number;
    date_added: number;
    date_updated: number;
    date_scanned: number;
    virus_status: number;
    virus_positive: number;
    virustotal_hash: null;
    filesize: number;
    filesize_uncompressed: number;
    filehash: {
      md5: string;
    };
    filename: string;
    version: null;
    changelog: null;
    metadata_blob: null;
    download: {
      binary_url: string;
      date_expires: number;
    };
    platforms: Array<unknown>;
  };
  dependencies: boolean;
  platforms: Array<unknown>;
  metadata_kvp: Array<unknown>;
  tags: Array<ModIOTag>;
  stats: {
    mod_id: number;
    popularity_rank_position: number;
    popularity_rank_total_mods: number;
    downloads_today: number;
    downloads_total: number;
    subscribers_total: number;
    ratings_total: number;
    ratings_positive: number;
    ratings_negative: number;
    ratings_percentage_positive: number;
    ratings_weighted_aggregate: number;
    ratings_display_text: string;
    date_expires: number;
  };
}

type ModIOComment = {
  id: number;
  game_id: number;
  mod_id: number;
  resource_id: number;
  user: ModIOUser;
  date_added: number;
  member_deleted: number;
  reply_id: number;
  thread_position: string;
  karma: number;
  karma_guest: number;
  content: string;
  partner: null;
  options: number;
}

type ModIOUser = {
    id: number;
    name_id: string;
    username: string;
    display_name_portal: null;
    date_online: number;
    date_joined: number;
    avatar: ModIOImages<{ thumb_50x50: string, thumb_100x100: string }>;
    timezone: string;
    language: string;
    profile_url: string;
}

type ModIOImages<T extends Record<`thumb_${number}x${number}`, string>> = {
    filename: string;
    original: string;
} & T;

type ModIOTag = {
    name: string;
    name_localized: string;
    date_added: number;
}