'use client';

import { useSelf } from '@liveblocks/react/suspense';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import Image from 'next/image';
import Share from '@/public/assets/icons/share.svg';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import UserTypeSelector from './UserTypeSelector';
import Collaborator from './Collaborator';
import { updateDocumentAccess } from '@/lib/actions/room.actions';

const ShareModal = ({
  roomId,
  collaborators,
  creatorId,
  currentUserType,
}: ShareDocumentDialogProps) => {
  // get user
  const user = useSelf();

  // states
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('viewer');

  // handler func to share doc
  const shareDocumentHandler = async () => {
    setLoading(true);
    await updateDocumentAccess({
      roomId,
      email,
      userType: userType as UserType,
      updatedBy: user.info,
    });
    setLoading(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          className="gradient-lime flex h-9 gap-1 px-4 "
          disabled={currentUserType !== 'editor'}
        >
          <Image
            width={20}
            height={20}
            className="min-w-4 md:size-5"
            alt="share"
            src={Share}
          />
          <p className="ml-1 hidden sm:block">Share</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog">
        <DialogHeader>
          <DialogTitle>Manage Users</DialogTitle>
          <DialogDescription>
            Select which users can view and edit this document.
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor="emial" className="mt-6 text-lime-100">
          Email address
        </Label>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 rounded-md bg-dark-400">
            <Input
              id="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="share-input"
            />
            <UserTypeSelector userType={userType} setUserType={setUserType} />
          </div>
          <Button
            type="submit"
            onClick={shareDocumentHandler}
            className="gradient-lime flex h-full gap-1 px-5"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Invite'}
          </Button>
        </div>
        <div className="my-2 space-y-2">
          <ul className="flex flex-col">
            {collaborators.map((collaborator) => {
              return (
                <Collaborator
                  key={collaborator.id}
                  roomId={roomId}
                  creatorId={creatorId}
                  email={collaborator.email}
                  collaborator={collaborator}
                  user={user.info}
                />
              );
            })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
