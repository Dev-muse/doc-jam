import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async ({ params: { id } }: SearchParamProps) => {
  // 1- get id of room from params , dynamic route

  const clerkUser = await currentUser();

  const clerkUserEmail = clerkUser?.emailAddresses?.[0]?.emailAddress;
  if (!clerkUserEmail) redirect("/sign-in");

  // get access to room/document
  const room = await getDocument({
    roomId: id,
    userId: clerkUserEmail,
  });

  if (!room) redirect("/");
  //TODO: assess the permisssion lvl of user to access the document/room

  // fetch all users in the room
  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds });

  const userData = users.map((user: User) => {
     const email = user?.email;
    return {
      ...user,
      userType:
        email && room.usersAccesses[email]?.includes("room:write")
          ? "editor"
          : "viewer",
    };
  });

  const currentUserType = room.usersAccesses[clerkUserEmail]?.includes(
    "room:write"
  )
    ? "editor"
    : "viewer";

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
