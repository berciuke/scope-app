"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [message, setMessage] = useState(null);
  const { login } = useAuth();
  const router = useRouter();

  const validationSchema = Yup.object({
    username: Yup.string().required("Nazwa użytkownika jest wymagana"),
    password: Yup.string().required("Hasło jest wymagane"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      const user = existingUsers.find(
        (user) => user.username.toLowerCase() === values.username.toLowerCase()
      );

      if (user && user.password === values.password) {
        login(user);
        router.push("/");
      } else {
        setMessage({
          type: "error",
          text: "Nieprawidłowa nazwa użytkownika lub hasło.",
        });
      }
    },
  });

  return (
    <div className="login-container">
      <h2>Logowanie</h2>
      {message && <div className={`alert alert-error`}>{message.text}</div>}
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

        <button type="submit">Zaloguj się</button>
      </form>
    </div>
  );
}
