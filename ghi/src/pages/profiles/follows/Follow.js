import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import '../css/follows.css'

const Follow = ({ token , authenticatedUser}) => {
  const [message, setMessage] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);

  const { author_id } = useParams();

  // Following Status
  const checkFollowingStatus = async () => {
    const url = `${process.env.REACT_APP_API_HOST}/api/author/${authenticatedUser.id}/followings`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data);
        setFollowingCount(data.length); //
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setMessage("Error checking following status.");
    }
  };

  useEffect(() => {
    if (authenticatedUser) {
      checkFollowingStatus();
    }
  }, [author_id, authenticatedUser]);


// Follow author
const handleFollow = async () => {
  const url = `${process.env.REACT_APP_API_HOST}/api/author/${authenticatedUser.id}/follow/${author_id}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json()
      setIsFollowing(data.is_following);
      alert(`You are successfully following ${author_id}`);
    } else {
      const errorData = await response.json();
      setMessage(`Error: ${errorData.detail}`);
    }
  } catch (error) {
    setMessage("Error following author.");
  }
};


// unfollow author
const handleUnfollow = async () => {
  const url = `${process.env.REACT_APP_API_HOST}/api/author/${authenticatedUser.id}/unfollow/${author_id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json()
      setIsFollowing(data.is_not_following);
      alert(`You Have Successfully Unfollowed ${author_id}`);
    } else {
      const errorData = await response.json();
      setMessage(`Error: ${errorData.detail}`);
    }
  } catch (error) {
    setMessage("Error unfollowing author.");
  }
};

  return (
    <div>
    {authenticatedUser && authenticatedUser.id !== author_id && (

        isFollowing ? (
          <button className="author-unfollow-btn" onClick={handleUnfollow}>Unfollow</button>
        ) : (
          <button className="author-follow-btn" onClick={handleFollow}>Follow</button>
        )
     )}
  </div>


// <div>
//       {authenticatedUser && (
//         <div>
//           <p>{`Following: ${followingCount}`}</p>
//           {authenticatedUser.id !== author_id && (
//             isFollowing ? (
//               <button className="author-unfollow-btn" onClick={handleUnfollow}>Unfollow</button>
//             ) : (
//               <button className="author-follow-btn" onClick={handleFollow}>Follow</button>
//             )
//           )}
//         </div>
//       )}
//     </div>

  );
};
export default Follow;
