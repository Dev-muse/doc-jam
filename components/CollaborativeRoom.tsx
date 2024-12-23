'use client';

import { Editor } from '@/components/editor/Editor';
import Header from '@/components/Header';
import { updateDocument } from '@/lib/actions/room.actions';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import ActiveCollaborators from './ActiveCollaborators';
import Loader from './Loader';
import ShareModal from './ShareModal';
import { Input } from './ui/input';

const CollaborativeRoom = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
}: CollaborativeRoomProps) => {
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  // need ref to dom element
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  //update title and change doc using server action
  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key == 'Enter') {
      setLoading(true);
      try {
        if (documentTitle !== roomMetadata.title) {
          const updatedDocument = await updateDocument(roomId, documentTitle);
          if (updatedDocument) {
            setEditing(false);
          }
        }
      } catch (error) {
        console.log('error updating document title', error);
      }

      setLoading(false);
    }
  };

  // checking if user clicked outside input node to change editing state
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditing(false);
        updateDocument(roomId, documentTitle);
      }
    };

    // add event listener to check click outside HEADER then remove it with cleanup function
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [roomId, documentTitle]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            {/* doc title*/}
            <div
              ref={containerRef}
              className="flex w-fit items-center justify-center gap-2"
            >
              {!loading && editing ? (
                <Input
                  type="text"
                  ref={inputRef}
                  value={documentTitle}
                  placeholder="Enter document title..."
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  disabled={!editing}
                  className="document-title-input"
                />
              ) : (
                <>
                  <p className="document-title">{documentTitle}</p>
                </>
              )}

              {currentUserType === 'editor' && !editing && (
                <Image
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  width={24}
                  height={24}
                  onClick={() => setEditing(true)}
                  className="pointer"
                />
              )}

              {currentUserType !== 'editor' && !editing && (
                <p className="view-only-tag">View only</p>
              )}
            </div>

            {loading && <p className="text-sm text-gray-400">Saving...</p>}

            <div className="flex w-full flex-1 justify-end gap-2">
              <ActiveCollaborators />
              <ShareModal
                roomId={roomId}
                collaborators={users}
                creatorId={roomMetadata.creatorId}
                currentUserType={currentUserType}
              />

              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            {/* user avatar /authentication */}
          </Header>
          {/* document editor */}
          <Editor roomId={roomId} currentUserType={currentUserType} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
