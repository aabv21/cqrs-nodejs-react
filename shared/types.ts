// Event Types
export enum EventType {
  POST_CREATED = "POST_CREATED",
  COMMENT_ADDED = "COMMENT_ADDED",
  COMMENT_DELETED = "COMMENT_DELETED",
}

// Command Types
export interface CreatePostCommand {
  type: "CREATE_POST";
  payload: {
    title: string;
    content: string;
    author_email: string;
  };
}

export interface AddCommentCommand {
  type: "ADD_COMMENT";
  payload: {
    post_id: number;
    content: string;
    email: string;
  };
}

export interface DeleteCommentCommand {
  type: "DELETE_COMMENT";
  payload: {
    post_id: number;
    comment_id: number;
  };
}

export type Command =
  | CreatePostCommand
  | AddCommentCommand
  | DeleteCommentCommand;

// Query Types
export interface PostQuery {
  type: "GET_POST";
  payload: {
    post_id: number;
  };
}

export interface PostsQuery {
  type: "GET_ALL_POSTS";
  payload: {
    page?: number;
    limit?: number;
    author_email?: string;
  };
}

export type Query = PostQuery | PostsQuery;

// Event Types
export interface Event<T = any> {
  type: EventType;
  data: T;
  timestamp: number;
  metadata?: {
    userId?: string;
    correlationId?: string;
  };
}

// Domain Types
export interface Post {
  id: number;
  title: string;
  content: string;
  author_email: string;
  createdAt: Date;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  post_id: number;
  content: string;
  email: string;
  createdAt: Date;
}

// Response Types
export interface CommandResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface QueryResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
