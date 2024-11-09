'use server';

import { RoomAccesses } from '@liveblocks/node';
import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { liveblocks } from '../liveblocks';
import { getAccessType, parseStringify } from '../utils';

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
      // don't want to give every user default write access with ['room:write']
      defaultAccesses: [],
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
    const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    if (!hasAccess) {
      throw new Error('You do not have acess to this document');
    }

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

// updating user access
export const updateDocumentAccess = async ({
  roomId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
  try {
    // list of all user accesses
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };

    // now update room
    const room = await liveblocks.updateRoom(roomId, { usersAccesses });

    if (room) {
      // send notification to user TODO:
      const notificationId = nanoid();
      await liveblocks.triggerInboxNotification({
        userId: email,
        // can create different kinds of notification elements for different notifications , see notifications component
        kind: '$documentAccess',
        subjectId: notificationId,
        activityData: {
          userType,
          title: `You have been granted ${userType} by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email,
        },
        roomId,
      });
    }
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while trying to update room access: ${error}`);
  }
};

// removing user

export const removeCollaborator = async ({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) => {
  try {
    // fetch info about room
    const room = await liveblocks.getRoom(roomId);

    if (room.metadata.email === email) {
      throw new Error('You cannot remove yourself from document');
    }

    // remove access
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    });

    // finally
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error occurred while removign a collaborator ${error}`);
  }
};

// delete document

export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);
    revalidatePath('/');

    redirect('/');
  } catch (error) {
    console.log(`Error happened while deleting room: ${error}`);
  }
};
