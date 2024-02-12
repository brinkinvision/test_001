import React, { useState, useEffect } from 'react';
import './UserInformationTable.css'

const UserInformationTable = () => {
  const [users, setUsers] = useState([]);
  const [searchColumn, setSearchColumn] = useState('key');
  const [searchValue, setSearchValue] = useState('');
  const [sortColumn, setSortColumn] = useState(0);
  const [sortDirection, setSortDirection] = useState('asc');
  const [modalContent, setModalContent] = useState(null);
  const [originalUsers, setOriginalUsers] = useState([]);

  useEffect(() => {
    fetch('https://dummyjson.com/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data.users);
        setOriginalUsers(data.users); // сохраняем исходные данные
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const handleSortColumnChange = (e) => { // обновленный обработчик события
    if (parseInt(e.target.value) === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); // меняем направление сортировки при повторном выборе того же столбца
    } else {
      setSortColumn(parseInt(e.target.value));
      setSortDirection('asc'); // сбрасываем направление сортировки при выборе нового столбца
    }
    sortTable(parseInt(e.target.value), 'asc');
  };

  const handleSearchColumnChange = (e) => {
    setSearchColumn(e.target.value);
  };

  const handleSortDirectionChange = (e) => {
    setSortDirection(e.target.value);
    sortTable(sortColumn, e.target.value);
  };

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    if (searchColumn && searchValue) {
      fetch(`https://dummyjson.com/users/filter?${searchColumn}=${searchValue}`)
        .then(response => response.json())
        .then(data => setUsers(data.users))
        .catch(error => console.error('Error:', error));
    }
  };

  const handleRowClick = (userInfo) => {
    setModalContent(
      <div>
        <p>Name: {userInfo.firstName} {userInfo.lastName}</p>
        <p>Age: {userInfo.age}</p>
        <p>Email: Presumed Email Here</p>
      </div>
    );
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const sortTable = (column, direction) => {
    const sortedUsers = direction === 'default' ? originalUsers : [...users].sort((a, b) => {
      const x = column === 0 ? `${a.firstName} ${a.lastName}` :
        column === 1 ? a.age :
        column === 2 ? a.gender :
        column === 3 ? a.phone :
          `${a.address.city}, ${a.address.country}`;
      const y = column === 0 ? `${b.firstName} ${b.lastName}` :
        column === 1 ? b.age :
        column === 2 ? b.gender :
        column === 3 ? b.phone :
          `${b.address.city}, ${b.address.country}`;

      if (direction === 'asc') {
        return x > y ? 1 : -1;
      } else {
        return x < y ? 1 : -1;
      }
    });
    setUsers(sortedUsers);
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toUpperCase();
    const age = `${user.age}`;
    const gender = `${user.gender}`.toUpperCase();
    const phoneNumber = `${user.phone}`;
    const address = `${user.address.city}`.toUpperCase();
    return fullName.concat(` ` + age).concat(` ` + gender).concat(` ` + phoneNumber).concat(` ` + address).toUpperCase().includes(searchValue.toUpperCase());
  });

  return (
    <div>
      <select onChange={handleSortColumnChange} value={sortColumn}>
        <option value={0}>Full Name</option>
        <option value={1}>Age</option>
        <option value={2}>Gender</option>
        <option value={3}>Phone Number</option>
        <option value={4}>Address</option>
        <option value={-1}>None</option>
      </select>
      <select onChange={handleSortDirectionChange} value={sortDirection}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
        <option value="default">None</option>
      </select>
      <select onChange={handleSearchColumnChange} value={searchColumn}>
        <option value="key">Search by...</option>
        <option value="firstName">First Name</option>
        <option value="lastName">Last Name</option>
        <option value="age">Age</option>
        <option value="gender">Gender</option>
        <option value="phone">Phone Number</option>
        <option value="address.city">City</option>
        <option value="address.country">Country</option>
      </select>
      <input type="text" placeholder="Search..." onChange={handleSearchValueChange} />
      <button onClick={handleSearch}>Search</button>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone Number</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index} onClick={() => handleRowClick(user)}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.age}</td>
              <td>{user.gender}</td>
              <td>{user.phone}</td>
              <td>{`${user.address.city}, ${user.address.country}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalContent &&
        <div>
          <div style={{ display: 'block', position: 'fixed', zIndex: 1, left: 0, top: 0, width: '100%', height: '100%', overflow: 'auto', backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div style={{ backgroundColor: '#fefefe', margin: '15% auto', padding: 20, border: '1px solid #888', width: '80%' }}>
              <span onClick={closeModal} style={{ color: '#aaa', float: 'right', fontSize: 28, fontWeight: 'bold' }}>&times;</span>
              {modalContent}
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default UserInformationTable;
