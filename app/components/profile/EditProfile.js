"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import ProfilePicture from "./ProfilePicture";
import UserSettings from "../UserSettings";
export default function EditProfile({ currentUser, onSubmit, onCancel }) {
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("Imię jest wymagane")
      .matches(
        /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż]+$/,
        "Imię może zawierać tylko litery"
      ),
    lastName: Yup.string()
      .required("Nazwisko jest wymagane")
      .matches(
        /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż]+$/,
        "Nazwisko może zawierać tylko litery"
      ),
    description: Yup.string().max(
      140,
      "Opis może zawierać maksymalnie 140 znaków."
    ),
    photo: Yup.string()
      .test("is-valid-photo", "Nieprawidłowy URL zdjęcia", (value) => {
        if (value == "/profile-picture.jpg") return true;
        const urlPattern = /^(https?:\/\/).+/i;
        const dataUrlPattern = /^data:image\/[a-z]+;base64,([A-Za-z0-9+/=]+)$/;
        return urlPattern.test(value) || dataUrlPattern.test(value);
      })
      .nullable(),
    city: Yup.string().min(3, "Miasto musi mieć minimalnie 3 znaki."),
    dateOfBirth: Yup.date()
      .max(new Date(), "Data urodzenia nie może być w przyszłości")
      .test(
        "is-old-enough",
        "Użytkownik musi mieć co najmniej 13 lat",
        (value) => {
          if (value == null) {
            return true;
          }
          let today = new Date();
          let birthDate = new Date(value);
          let age = today.getFullYear() - birthDate.getFullYear();
          let monthDiff = today.getMonth() - birthDate.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }
          return age >= 13;
        }
      ),
  });

  const formik = useFormik({
    initialValues: {
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      description: currentUser.description || "",
      photo: currentUser.photo || "",
      city: currentUser.city || "",
      dateOfBirth: currentUser.dateOfBirth || "",
      privacy: currentUser.privacy || "public", 
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-group">
        <label htmlFor="photo">Zdjęcie:</label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/jpeg, image/png"
          onChange={(e) => {
            const file = e.target.files[0];
            if (
              file &&
              (file.type === "image/jpeg" || file.type === "image/png")
            ) {
              const reader = new FileReader();
              reader.onload = () => {
                formik.setFieldValue("photo", reader.result);
              };
              reader.readAsDataURL(file);
            } else {
              formik.setFieldError(
                "photo",
                "Akceptowane formaty to JPG i PNG."
              );
            }
          }}
        />
        {formik.values.photo && (
          <ProfilePicture src={formik.values.photo} alt="Podgląd zdjęcia" />
        )}
        {formik.errors.photo && formik.touched.photo && (
          <div className="alert alert-error">{formik.errors.photo}</div>
        )}
      </div>

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
        {formik.errors.firstName && formik.touched.firstName && (
          <div className="alert alert-error">{formik.errors.firstName}</div>
        )}
      </div>

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
        {formik.errors.lastName && formik.touched.lastName && (
          <div className="alert alert-error">{formik.errors.lastName}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Opis:</label>
        <textarea
          id="description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows="4"
        ></textarea>
        {formik.errors.description && formik.touched.description && (
          <div className="alert alert-error">{formik.errors.description}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="city">Miasto:</label>
        <input
          type="text"
          id="city"
          name="city"
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.city && formik.touched.city && (
          <div className="alert alert-error">{formik.errors.city}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="dateOfBirth">Data Urodzenia:</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formik.values.dateOfBirth || "2000-01-01"}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.errors.dateOfBirth && formik.touched.dateOfBirth && (
          <div className="alert alert-error">{formik.errors.dateOfBirth}</div>
        )}
        <div className="form-group mb-2">
          <label htmlFor="privacy">Prywatność profilu:</label>
          <select
            id="privacy"
            name="privacy"
            value={formik.values.privacy}
            onChange={formik.handleChange}
            className="w-full p-2 text-black"
          >
            <option value="public">Publiczny</option>
            <option value="private">Prywatny</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center gap-1 p-3">
        <button type="submit">Zapisz</button>
        <button type="button" onClick={onCancel}>
          Anuluj
        </button>
      </div>
      <div className="container mx-auto p-4">
            <UserSettings />
          </div>
    </form>
  );
}
