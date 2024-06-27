import React, { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { User } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
}

const ShowUser: React.FC<Props> = ({ userId }) => {
  const [friend, setFriend] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const response = await axios.get<User>(
          `http://localhost:3000/api/user/id/${userId}`
        );
        setFriend(response.data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFriend();
  }, [userId]);

  const handleNavigateFriend = (friendUsername: string) => {
    router.push(`/u/${friendUsername}`)
  }

  if (loading) {
    return (
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="w-[160px] h-[260px] rounded-md" />
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
