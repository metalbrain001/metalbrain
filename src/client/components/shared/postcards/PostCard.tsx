import { useUserContext } from '@/lib/context/user/userContext';
import { timeAgo } from '@/lib/utils';
import { IUpdatePost } from '@/types';
import { Link } from 'react-router-dom';
import PostStats from '../post/PostStats';

type PostCardProps = {
  post: IUpdatePost;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post?.creator_id}`}>
            <img
              src={
                post?.User?.profilePic
                  ? `${post?.User?.profilePic}`
                  : post?.User?.avatarUrl
                    ? `${post?.User?.avatarUrl}`
                    : '/assets/images/default-profile.jpg'
              }
              alt="creator"
              loading="lazy"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-meduim lg:body-bold text-light-1">
              {post?.User?.firstName} {post?.User?.lastName}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {post?.created_at && timeAgo(post?.created_at.toString())}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post?.location}
              </p>
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post.id}`}
          className={`${user?.id?.toString() !== String(post?.User?.id) && 'hidden'}`}
        >
          <img
            src="/assets/icons/edit.svg"
            alt="edit"
            loading="lazy"
            width={24}
            height={24}
          />
        </Link>
      </div>
      <Link to={`/posts/${post.id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags?.split(',').map((tag, index) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={`${post?.imageUrl}` || '/assets/icons/image-placeholder.svg'}
          alt="post-image"
          loading="lazy"
          className="post-card_img"
        />
      </Link>
      <PostStats post={post} id={post?.creator_id} />
    </div>
  );
};

export default PostCard;
