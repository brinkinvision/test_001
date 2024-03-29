import React, { useState, useEffect } from "react";
import "./UserInformationTable.css";

const UserInformationTable = () => {
  const [users, setUsers] = useState([]);
  const [searchColumn, setSearchColumn] = useState("key");
  const [searchValue, setSearchValue] = useState("");
  const [sortColumn, setSortColumn] = useState(0);
  const [sortDirection, setSortDirection] = useState("default");
  const [modalContent, setModalContent] = useState(null);
  const [originalUsers, setOriginalUsers] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.users);
        setOriginalUsers(data.users);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const clearFilters = () => {
    setSearchColumn("key");
    setSearchValue("");
    setSortColumn(0);
    setSortDirection("default");
    setModalContent(null);
    setIsFiltering(false);
    setUsers(originalUsers);
  };

  const handleClear = () => {
    setSearchValue("");
    setUsers(originalUsers);
  };

  const handleSortColumnChange = (e) => {
    if (parseInt(e.target.value) === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(parseInt(e.target.value));
      setSortDirection("default");
    }
    sortTable(parseInt(e.target.value), "default");
  };

  const handleSearchColumnChange = (e) => {
    setSearchColumn(e.target.value);
  };

  const handleSortDirectionChange = (e) => {
    setSortDirection(e.target.value);
    sortTable(sortColumn, e.target.value);
  };

  const handleSearchValueChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (searchColumn !== "key" && value) {
      const filteredUsers = originalUsers.filter((user) => {
        if (searchColumn === "age") {
          return user[searchColumn] === parseInt(value);
        } else if (searchColumn === "gender") {
          return user[searchColumn] === value;
        } else if (searchColumn === "address.city") {
          return user.address.city.toLowerCase().includes(value.toLowerCase());
        } else if (searchColumn === "address.address") {
          return user.address.toLowerCase().includes(value.toLowerCase());
        } else {
          return user[searchColumn]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      });
      setUsers(filteredUsers);
    } else {
      setUsers(originalUsers);
    }
  };

  const handleRowClick = (userInfo) => {
    setModalContent(
      <div>
        <p>
          <h2>
            {userInfo.firstName} {userInfo.lastName} {userInfo.maidenName}
          </h2>
        </p>
        <p>
          <b>Возраст:</b> {userInfo.age}
        </p>
        <p>
          <b>Адрес:</b> {userInfo.address.city}, {userInfo.address.address}
        </p>
        <p>
          <b>Рост:</b> {userInfo.height}
        </p>
        <p>
          <b>Вес:</b> {userInfo.weight}
        </p>
        <p>
          <b>Номер телефона:</b> {userInfo.phone}
        </p>
        <p>
          <b>Email:</b> {userInfo.email}
        </p>
      </div>
    );
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const sortTable = (column, direction) => {
    const sortedUsers =
      direction === "default"
        ? originalUsers
        : [...users].sort((a, b) => {
            const x =
              column === 0
                ? `${a.firstName} ${a.lastName}`
                : column === 1
                ? a.age
                : column === 2
                ? a.gender
                : column === 3
                ? a.phone
                : `${a.address.city}, ${a.address.address}`;
            const y =
              column === 0
                ? `${b.firstName} ${b.lastName}`
                : column === 1
                ? b.age
                : column === 2
                ? b.gender
                : column === 3
                ? b.phone
                : `${b.address.city}, ${b.address.address}`;

            if (direction === "asc") {
              return x > y ? 1 : -1;
            } else {
              return x < y ? 1 : -1;
            }
          });
    setUsers(sortedUsers);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toUpperCase();
    const age = `${user.age}`;
    const gender = `${user.gender}`.toUpperCase();
    const phoneNumber = `${user.phone}`;
    const address_city = `${user.address.city}`.toUpperCase();
    const address_street = `${user.address.address}`.toUpperCase();
    return fullName
      .concat(` ` + age)
      .concat(` ` + gender)
      .concat(` ` + phoneNumber)
      .concat(` ` + address_city)
      .concat(` ` + address_street)
      .toUpperCase()
      .includes(searchValue.toUpperCase());
  });

  return (
    <div>
      <div>
        <label>Сортировать по: </label>
        <select onChange={handleSortColumnChange} value={sortColumn}>
          <option value={0}>ФИО</option>
          <option value={1}>Возраст</option>
          <option value={2}>Пол</option>
          {/* <option value={3}>Номер телефона</option> */}
          <option value={4}>Адрес</option>
        </select>
        <select onChange={handleSortDirectionChange} value={sortDirection}>
          <option value="default">Без сортировки</option>
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          clearFilters();
        }}
      >
        <label htmlFor="searchInput">Поиск: </label>
        <input
          type="text"
          id="searchInput"
          placeholder=""
          onChange={handleSearchValueChange}
          value={searchValue}
        />

        <select onChange={handleSearchColumnChange} value={searchColumn}>
          <option value="key">Искать по...</option>
          <option value="firstName">Имя</option>
          <option value="lastName">Фамилия</option>
          <option value="age">Возраст</option>
          <option value="gender">Пол</option>
          <option value="phone">Номер телефона</option>
          <option value="address.city">Город</option>
          <option value="address.address">Улица</option>
        </select>

        <button onClick={handleClear}>Очистить</button>
      </form>
      <br />
      <table>
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Возраст</th>
            <th>Пол</th>
            <th>Номер телефона</th>
            <th>Адрес</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index} onClick={() => handleRowClick(user)}>
              <td>
                {user.firstName} {user.lastName} {user.maidenName}
              </td>
              <td>{user.age}</td>
              <td>{user.gender}</td>
              <td>{user.phone}</td>
              <td>{`${user.address.city}, ${user.address.address}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalContent && (
        <div>
          <div
            style={{
              display: "block",
              position: "fixed",
              zIndex: 1,
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              overflow: "auto",
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                backgroundColor: "#fefefe",
                margin: "15% auto",
                padding: 20,
                border: "1px solid #888",
                width: "80%",
              }}
            >
              <span
                className="close-modal"
                onClick={closeModal}
                style={{
                  color: "#aaa",
                  float: "right",
                  fontSize: 28,
                  fontWeight: "bold",
                }}
              >
                &times;
              </span>
              {modalContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInformationTable;
