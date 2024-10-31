import CollaborativeRoom from '@/components/CollaborativeRoom';
import { getDocument } from '@/lib/actions/room.actions';
import { getClerkUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const Document = async ({ params: { id } }: SearchParamProps) => {
  // 1- get id of room from params , dynamic route

  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  // get access to room/document
  const room = await getDocument({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) redirect('/');
  //TODO: assess the permisssion lvl of user to access the document/room

  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds });

  const userData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes('room:write')
      ? 'editor'
      : 'viewer',
  }));

  const currentUserType = room.usersAccesses[
    clerkUser.emailAddresses[0].emailAddress
  ]?.includes('room:write')
    ? 'editor'
    : 'viewer';

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={userData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
