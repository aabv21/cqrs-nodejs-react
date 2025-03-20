import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import AddCommentModal from "./AddCommentModal";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  email: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  email: string;
  comments: Comment[];
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`);
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error("Failed to fetch post details", error);
      toast.error("Failed to fetch post details");
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: "DELETE",
      });
      toast.success("Post deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Failed to delete post", error);
      toast.error("Failed to delete post");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await fetch(
        `http://localhost:3000/api/posts/${id}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );
      toast.success("Comment deleted successfully");
      fetchPost();
    } catch (error) {
      console.error("Failed to delete comment", error);
      toast.error("Failed to delete comment");
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container mx-auto max-w-2xl">
      <Button variant="outline" onClick={() => navigate("/")} className="mb-4">
        Back to Posts
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Post
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{post.email}</p>
        </CardHeader>
        <CardContent>
          <p className="mb-8">{post.content}</p>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Comments</h2>
              <Button onClick={() => setIsCommentModalOpen(true)}>
                Add Comment
              </Button>
            </div>

            {post.comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p>{comment.content}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        By: {comment.email}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddCommentModal
        open={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        post_id={id!}
        onSuccess={() => {
          setIsCommentModalOpen(false);
          fetchPost();
        }}
      />
    </div>
  );
}
