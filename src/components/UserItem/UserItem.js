import React from 'react';
import { useNavigate } from 'react-router-dom';

import defProfileImg from '../../assets/profile.png';

const UserItem = ({ id, name }) => {
  const navigate = useNavigate();

  return (
    <li
      className="list-group-item list-group-item-action"
      key={id}
      onClick={() => {
        navigate(`/users/${id}`);
      }}
      style={{ cursor: 'pointer' }}
    >
      <img
        className="rounded-circle shadow-sm"
        src={defProfileImg}
        alt="default profile"
        width="30"
      />
      {name}
    </li>
  );
};

export default UserItem;
