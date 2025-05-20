"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import UserCardGrid from "../components/search/UserCardGrid";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

export default function SearchPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [city, setCity] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    setResults(allUsers);
  }, [currentUser, router]);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDay = new Date(dob);
    let age = today.getFullYear() - birthDay.getFullYear();
    const monthDifference = today.getMonth() - birthDay.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDay.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleSearch = () => {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    let filtered = [...allUsers];

    if (firstName.trim()) {
      filtered = filtered.filter((u) =>
        u.firstName?.toLowerCase().includes(firstName.toLowerCase())
      );
    }
    if (lastName.trim()) {
      filtered = filtered.filter((u) =>
        u.lastName?.toLowerCase().includes(lastName.toLowerCase())
      );
    }

    if (showAdvanced) {
      if (city.trim()) {
        filtered = filtered.filter((u) =>
          u.city?.toLowerCase().includes(city.toLowerCase())
        );
      }
      if (minAge) {
        filtered = filtered.filter((u) => {
          const age = calculateAge(u.dateOfBirth);
          return age !== null && age >= parseInt(minAge, 10);
        });
      }
      if (maxAge) {
        filtered = filtered.filter((u) => {
          const age = calculateAge(u.dateOfBirth);
          return age !== null && age <= parseInt(maxAge, 10);
        });
      }
    }

    const usersWithAge = filtered.map((u) => ({
      ...u,
      age: calculateAge(u.dateOfBirth),
    }));

    setResults(usersWithAge);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Wyszukiwarka użytkowników</h1>
      <div className="search-bar flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="whitespace-nowrap">Imię:</label>
          <input
            type="text"
            placeholder="np. Jan"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="flex-1 min-w-[120px]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label>Nazwisko:</label>
          <input
            type="text"
            placeholder="np. Kowalski"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="flex-1 min-w-[120px]"
          />
        </div>
        <button onClick={handleSearch} className="px-4 py-2">
          Szukaj
        </button>
        <button onClick={() => setShowAdvanced((prev) => !prev)} className="px-4 py-2" title="Pokaż/ukryj filtry zaawansowane">
  {showAdvanced ? <MdExpandLess /> : <MdExpandMore />}
</button>
      </div>
      {showAdvanced && (
        <div className="advanced-search flex flex-col sm:flex-row gap-2 mb-4 pl-1">
          <div className="flex items-center gap-2">
            <label>Miasto:</label>
            <input
              type="text"
              placeholder="np. Warszawa"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label>Wiek od:</label>
            <input
              type="number"
              min="13"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              className="w-16"
            />
          </div>
          <div className="flex items-center gap-2">
            <label>Wiek do:</label>
            <input
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              className="w-16"
            />
          </div>
        </div>
      )}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Wyniki ({results.length})
        </h2>
        <UserCardGrid users={results} />
      </div>
    </div>
  );
}
