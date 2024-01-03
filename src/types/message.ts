export type Message = {
  channel?: string;
  id: number;
  type: number;
  created_at: string;
  content: string;
  clean_content: string;
  jump_url: string;
  author: {
    id: number;
    name: string;
    global_name: string;
  };
  reference?: {
    message_id: number;
    channel_id: number;
    guild_id: number
  };
  attachments?: {
    id: number;
    content_type: string;
    url: string;
    proxy_url: string;
  }[];
}
