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

    // level of access , started with only user who created room having write access:
    /* const usersAccesses: RoomAccesses = {
      [email]: ['room:write'],
    };*/

    const usersAccesses: RoomAccesses = {
      [email]: ['room:write'],
    };

    // creating room :copied from https://liveblocks.io/docs/authentication/id-token/nextjs
    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ['room:write'],
    });

    // new document on frontend whenever a room is created
    revalidatePath('/');

    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while creating document ${error}`);
  }
};

// server action to get a single document
export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    // get access to room
    const room = await liveblocks.getRoom(roomId);

    // check if user has access if their id is in the object
    //TODO: Uncomment this later to restrict access
    // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    // if (!hasAccess) {
    //   throw new Error('You do not have acess to this document');
    // }

    return parseStringify(room);
  } catch (error) {
    console.log('error occurred while getting a room ', error);
  }
};
// server action to get all documents
export const getDocuments = async (email: string) => {
  try {
    // get access to all rooms where userid == email
    const rooms = await liveblocks.getRooms({ userId: email });

    // check if user has access if their id is in the object
    //TODO: Uncomment this later to restrict access
    // const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    // if (!hasAccess) {
    //   throw new Error('You do not have acess to this document');
    // }

    return parseStringify(rooms);
  } catch (error) {
    console.log('error occurred while getting rooms', error);
  }
};

// server action to update a document
export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: { title },
    });

    revalidatePath(`/document/${roomId}`);

    return parseStringify(updatedRoom);
  } catch (error) {
    console.log('Error occurred while updating the rooom', error);
  }
};
