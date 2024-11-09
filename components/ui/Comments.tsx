import { cn } from '@/lib/utils';
import { useIsThreadActive } from '@liveblocks/react-lexical';
import { Composer, Thread } from '@liveblocks/react-ui';
import { useThreads } from '@liveblocks/react/suspense';

type Props = {};

const ThreadsWrapper = ({ thread }: ThreadWrapperProps) => {
  const isActive = useIsThreadActive(thread.id);

  return (
    <Thread
      thread={thread}
      data-state={isActive ? 'active' : null}
      className={cn(
        'commnet-thread border',
        isActive && 'border-lime-700 shadow-md ',
        thread.resolved && 'opacity-40'
      )}
    />
  );
};

const Comments = (props: Props) => {
  const { threads } = useThreads();

  return (
    <div className="comments-container">
      <Composer className="comment-composer" />
      {threads.map((thread) => (
        <ThreadsWrapper key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default Comments;
