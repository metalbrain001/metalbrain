import Loader from '@/components/shared/Loader';
import { useUserContext } from '@/lib//context/user/userContext';
import {
  useDeleteLikePost,
  useDeletePost,
  useLikePost,
  useSavePost,
} from '@/lib/react-query/postQueryMutations/PostQueryAndMutations';
import { IUpdatePost } from '@/types';
import { useEffect, useState } from 'react';

type PostStatsProps = {
  post: IUpdatePost;
  id: string;
};

const PostStats = ({ post }: PostStatsProps) => {
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [isSaved, setIsSaved] = useState(false);
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deletePost, isPending: isDeletingSaved } = useDeletePost();
  const { mutate: deleteLikePost } = useDeleteLikePost();
  const { user } = useUserContext();

  useEffect(() => {
    if (user) {
      const savedPost = JSON.parse(localStorage.getItem('savedPost') || '{}');
      if (savedPost[post.id] === user.id) {
        setIsSaved(true);
      }
      setIsSaved(
        !!post.id &&
          user?.id.toString() === post.creator_id &&
          savedPost[post.id] === user.id
      );
    }
  }, [post?.id]);

  const handLikePost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (likesCount > 0) {
        setLikesCount(likesCount - 1);
        deleteLikePost({ post_id: String(post.id), user_id: String(user?.id) });
      } else {
        setLikesCount(likesCount + 1);
        likePost({ post_id: String(post.id), likes_count: String(user?.id) });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      if (likesCount > 0) {
        setLikesCount(likesCount + 1);
      } else {
        setLikesCount(likesCount - 1);
      }
    }
  };

  const handleSavePost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      setIsSaved(false);
      deletePost({ post_id: String(post.id), user_id: String(user?.id) });
      sessionStorage.setItem(
        'savedPost',
        JSON.stringify({
          ...JSON.parse(sessionStorage.getItem('savedPost') || '{}'),
          [post.id]: user?.id,
        })
      );
    } else {
      savePost({ post_id: post.creator_id, user_id: String(user?.id) });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={
            likesCount > 0
              ? '/assets/icons/liked.svg'
              : '/assets/icons/like.svg'
          }
          alt="Like"
          loading="lazy"
          width={20}
          height={20}
          onClick={handLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likesCount}</p>
      </div>
      <div className="flex gap-2">
        {isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'}
            alt="Like"
            loading="lazy"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
