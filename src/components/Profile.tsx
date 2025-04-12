import { useAuth } from "@/context/AuthContext";
import { IoLogOutOutline } from "react-icons/io5";

const Profile = () => {
  const { user, logout } = useAuth();
  return (
    <div className="group relative">
      <p className="uppercase min-h-7 cursor-pointer min-w-7 h-7 w-7 flex justify-center items-center text-lg font-bold aspect-square rounded-full bg-primary text-white">
        {user?.name.charAt(0)}
      </p>
      <div className="opacity-0 hidden group-hover:block group-hover:opacity-100 bg-white shadow-md border absolute right-0 rounded-xl">
        <div className="border-b px-4 pt-3 pb-3">
          <p className="font-bold text-lg capitalize">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <div className="">
          <p
            onClick={logout}
            className="flex hover:bg-gray-100 cursor-pointer items-center border-t p-4 gap-2"
          >
            <IoLogOutOutline className="text-xl text-gray-400" />
            <span className="text-sm text-black font-semibold">Sign out</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
