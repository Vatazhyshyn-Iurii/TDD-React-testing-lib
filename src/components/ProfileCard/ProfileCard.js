import React from 'react';

import defProfileImg from '../../assets/profile.png';

const ProfileCard = ({ user }) => {
  return (
    <div className="card text-center" data-testid="profile-card">
      <div className="card-header">
        <img
          className="rounded-circle shadow"
          src={user.image || defProfileImg}
          alt="default profile"
          width="200"
        />
      </div>
      <div className="card-body">
        <h3>{user.username}</h3>
      </div>
      <div className="card-footer">{/*<p>{user.email}</p>*/}</div>
      {/*{user.id === auth.id && <button>Edit</button>}*/}
    </div>
  );
};

export default ProfileCard;
