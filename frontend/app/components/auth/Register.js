"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Register() {
  const [message, setMessage] = useState(null);
  const { login } = useAuth();
  const router = useRouter();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Nazwa użytkownika musi mieć przynajmniej 3 znaki")
      .max(12, "Nazwa użytkownika musi mieć mniej niż 12 znaków")
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        "Nazwa użytkownika może zawierać tylko litery, cyfry, podłogi i myślniki, bez spacji"
      )
      .required("Nazwa użytkownika jest wymagana"),
    email: Yup.string()
      .email("Nieprawidłowy adres email")
      .required("Email jest wymagany"),
    password: Yup.string()
      .min(6, "Hasło musi mieć przynajmniej 6 znaków")
      .required("Hasło jest wymagane"),
    firstName: Yup.string()
      .required("Imię jest wymagane")
      .matches(
        /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż]+$/,
        "Imię może zawierać tylko litery"
      ),
    lastName: Yup.string()
      .matches(
        /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż]+$/,
        "Nazwisko może zawierać tylko litery"
      )
      .required("Nazwisko jest wymagane"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      privacy: "public"
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = existingUsers.find(
        (user) => user.username === values.username
      );
      const emailExists = existingUsers.find(
        (user) => user.email === values.email
      );

      if (userExists) {
        setMessage({
          type: "error",
          text: "Nazwa użytkownika jest już zajęta.",
        });
      } else if (emailExists) {
        setMessage({ type: "error", text: "Email jest już używany." });
      } else {
        const newUser = {
          id: uuidv4(),
          ...values,
          photo: "/profile-picture.jpg",
        };
        const updatedUsers = [...existingUsers, newUser];
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        login(newUser);
        resetForm();
        router.push("/");
      }
    },
  });

  return (
    <div className="register-container">
      <h2>Rejestracja</h2>
      {message && (
        <div
          className={`alert ${
            message.type === "error" ? "alert-error" : "alert-success"
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Login:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
        </div>
        {formik.touched.username && formik.errors.username ? (
          <div className="alert alert-error">{formik.errors.username}</div>
        ) : null}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
        </div>
        {formik.touched.email && formik.errors.email ? (
          <div className="alert alert-error">{formik.errors.email}</div>
        ) : null}

        <div className="form-group">
          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
        </div>
        {formik.touched.password && formik.errors.password ? (
          <div className="alert alert-error">{formik.errors.password}</div>
        ) : null}

        <div className="form-group">
          <label htmlFor="firstName">Imię:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
        </div>
        {formik.touched.firstName && formik.errors.firstName ? (
          <div className="alert alert-error">{formik.errors.firstName}</div>
        ) : null}

        <div className="form-group">
          <label htmlFor="lastName">Nazwisko:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
        </div>
        {formik.touched.lastName && formik.errors.lastName ? (
          <div className="alert alert-error">{formik.errors.lastName}</div>
        ) : null}

        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
  );
}
