import React from 'react';
import { useAuthors } from './useAuthors';

function AuthorsInfo() {
  const authorsList = useAuthors(); 

  if (authorsList === undefined) {
    return null;
  }

  return (
    <>
      <div>
        {authorsList.map((author) => (
          <div key={author.id}>
            <ul>
              <li>{author.username}</li>
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export default AuthorsInfo;
