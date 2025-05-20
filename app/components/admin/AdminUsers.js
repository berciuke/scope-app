import { useState, useEffect } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const handleDeleteUser = (userId) => {
    if (confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
      const updatedUsers = users.filter((user) => user.id !== userId);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      alert("Użytkownik został usunięty.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Zarządzanie użytkownikami</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Login</th>
            <th className="border px-4 py-2">Imię</th>
            <th className="border px-4 py-2">Nazwisko</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.firstName}</td>
              <td className="border px-4 py-2">{user.lastName}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                {user.username !== "admin" && (
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Usuń
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
