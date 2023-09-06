import React, { useState } from "react"
import '../css/settings.css'
import HamburgerMenu from '../HamburgerMenu';
import AvatarUpload from "./avatarUpload";
import UpdateUserInfo from "./UpdateUserInfo";





function Settings( {token, user} ) {
    const [activeContent, setActiveContent] = useState('profileInfo')

return (
 <>
    <div className="admin-account-profile">
    <div className="setting-banner">
            <div className="profile-image-container">
               < AvatarUpload token={token} authenticatedUser={user}/>
             </div>
         </div>

     <div className="setting-button">
                    <ul className="setting-ul">
                        <li className="setting-btn-li"  onClick={() => setActiveContent('profileInfo')}>
                            Profile Info
                        </li>
                          <li className="setting-btn-li"  onClick={() => setActiveContent('analytics')}>
                           Analytics
                        </li>

                        <li className="setting-btn-li"  onClick={() => setActiveContent('patreon')}>
                            Patreon
                        </li>
                        <li className="setting-btn-li">
                            Store
                        </li>
                    </ul>
                </div>

        <div className="setting-data-container">
                {activeContent === 'profileInfo' &&
                   <div className="setting-information-container">
                       <UpdateUserInfo token={token} authenticatedUser={user}/>

                </div>
             }

              {activeContent  === 'analytics'  &&
              <div className="setting-information-body">
                 <h1>Analytics</h1>
                 </div>

               }
              {activeContent  === 'patreon'  &&
                 <div className="setting-information-body">
                   <p>follower 1</p>
                   <p>follower 2</p>
                   <p>follower 3</p>
                  </div>
             }
         </div>
   </div>
</>

  );
}

export default Settings;
