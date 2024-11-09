import DeleteModal from '@/components/DeleteModal';
import Header from '@/components/Header';
import Notifications from '@/components/Notifications';
import AddDocumentBtn from '@/components/ui/AddDocumentBtn';
import { getDocuments } from '@/lib/actions/room.actions';
import { dateConverter } from '@/lib/utils';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

const Home = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/sign-in');

  const roomDocuments = await getDocuments(
    clerkUser.emailAddresses[0].emailAddress
  );
  return (
    <div>
      <main className="home-container">
        <Header className="sticky left-0 top-0">
          <div className="flex items-center gap-2 lg:gap-4">
            <Notifications />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </Header>
        {roomDocuments.data.length > 0 ? (
          <div className="document-list-container">
            <div className="document-list-title">
              <h3 className="text-28-semibold">All Documents</h3>
              <AddDocumentBtn
                userId={clerkUser.id}
                email={clerkUser.emailAddresses[0].emailAddress}
              />
            </div>
            <ul className="document-ul">
              {roomDocuments.data.map(({ id, createdAt, metadata }: any) => (
                <li className="document-list-item" key={id}>
                  <Link
                    className="flex flex-1 items-center gap-4"
                    href={`/documents/${id}`}
                  >
                    <div className="hidden sm:block bg-dark-500 rounded-md">
                      <Image
                        src={'/assets/icons/doc.svg'}
                        width={40}
                        height={40}
                        alt="file"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="line-clamp-1 text-lg">{metadata.title}</p>
                      <p className="text-sm font-light text-blue-100">
                        {/* function to calculate how long ago doc was created */}
                        Created about {dateConverter(createdAt)}
                      </p>
                    </div>
                  </Link>
                  <DeleteModal roomId={id} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="document-list-empty">
            <Image
              src="/assets/icons/doc.svg"
              alt="Document"
              width={40}
              height={40}
              className="mx-auto"
            />
            <AddDocumentBtn
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
