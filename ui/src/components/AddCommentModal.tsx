import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
interface AddCommentModalProps {
  open: boolean;
  onClose: () => void;
  post_id: string;
  onSuccess: () => void;
}

export default function AddCommentModal({
  open,
  onClose,
  post_id,
  onSuccess,
}: AddCommentModalProps) {
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/${post_id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content, email }),
        }
      );

      if (response.ok) {
        toast.success("Comment added successfully");
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to add comment", error);
      toast.error("Failed to add comment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Textarea
              placeholder="Comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Add Comment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
