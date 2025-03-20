export interface Post {
  _id: number;
  title: string;
  content: string;
  author_email: string;
  createdAt: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  author_email: string;
  createdAt: string;
}

export interface PostFormData {
  title: string;
  content: string;
  author_email: string;
}

export interface CommentFormData {
  content: string;
  author_email: string;
}
