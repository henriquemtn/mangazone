import React, { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { User } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";

interface Props {
  username: string;
}

const ShowUser: React.FC<Props> = ({ username }) => {
  const [friend, setFriend] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const response = await axios.get<User>(
          `https://api-mangazone.onrender.com/api/user/${username}`
        );
        setFriend(response.data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFriend();
  }, [username]);

  const handleNavigateFriend = (friendUsername: string) => {
    router.push(`/u/${friendUsername}`)
  }

  if (loading) {
    return (
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="w-[52px] h-[52px] rounded-full" />
        </div>
      </div>
    );
  }

  if (error) return <div>Error fetching friend: {error}</div>;

  return (
    <div>
      {friend ? (
        <div className="flex h-auto rounded items-start justify-between flex-col transition-all cursor-pointer">
          <div onClick={() => handleNavigateFriend(friend.username)} className="w-[52px] h-[52px] hover:scale-105 transition-all">
            <Avatar>
              <AvatarFallback>
                {friend.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
              <AvatarImage
                height={52}
                width={52}
                src={friend.photoURL}
                alt={friend.displayName}
              />
            </Avatar>
          </div>
        </div>
      ) : (
        <div>No friend found.</div>
      )}
    </div>
  );
};

export default ShowUser;
