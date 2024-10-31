import CollaborativeRoom from '@/components/CollaborativeRoom';
import { getDocument } from '@/lib/actions/room.actions';
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

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom roomId={id} roomMetadata={room.metadata} />
    </main>
  );
};

export default Document;
