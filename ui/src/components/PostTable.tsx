import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import CreatePostModal from "./CreatePostModal";
import { toast } from "sonner";

interface Post {
  _id: number;
  title: string;
  content: string;
  author_email: string;
}

export default function PostTable() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/posts");
      const data = await response.json();
      setPosts(data.data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
      toast.error("Failed to fetch posts");
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await fetch(`http://localhost:3000/api/posts/${postId}`, {
        method: "DELETE",
      });
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error("Failed to delete post", error);
      toast.error("Failed to delete post");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>Create Post</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">Content</TableHead>
            <TableHead className="text-center">Author</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post._id}>
              <TableCell className="text-center">{post.title}</TableCell>
              <TableCell className="text-center">
                {post.content.slice(0, 80) +
                  `${post.content.length > 80 ? "..." : ""}`}
              </TableCell>
              <TableCell className="text-center">{post.author_email}</TableCell>
              <TableCell className="text-center flex justify-center gap-2">
                <Button
                  variant="default"
                  onClick={() => navigate(`/${post._id}`)}
                >
                  Details
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreatePostModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          setTimeout(() => {
            fetchPosts();
          }, 500);
        }}
      />
    </div>
  );
}
