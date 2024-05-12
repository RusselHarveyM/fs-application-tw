import UserItem from "./UserItem";

export default function RecentUsers({ users, numberOfAttendees }) {
  return (
    <div className="md:w-1/4 sm:full h-full bg-white shadow rounded-2xl p-8">
      <h2 className="text-lg text-neutral-700 font-semibold">Recent Users</h2>
      <p className="text-neutral-400 text-sm">
        {numberOfAttendees} users attended to this room.
      </p>
      {users.users.map((user, index) => {
        return (
          <UserItem key={index} name={`${user?.firstName} ${user?.lastName}`} />
        );
      })}
    </div>
  );
}
