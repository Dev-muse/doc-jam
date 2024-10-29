'use server';

import { nanoid } from 'nanoid';
import { liveblocks } from '../liveblocks';
import { RoomAccesses } from '@liveblocks/node';
import { revalidatePath } from 'next/cache';
import { parseStringify } from '../utils';

// a room is synonymous with a document
// server action to create new document + room , to be called from front end when user clicks btn
export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: 'Untitled',
    };

    // level of access
    const usersAccesses: RoomAccesses = {
      [email]: ['room:write'],
    };

    // creating room :copied from https://liveblocks.io/docs/authentication/id-token/nextjs
    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    });

    // new document on frontend whenever a room is created
    revalidatePath('/');

    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while creating document ${error}`);
  }
};
