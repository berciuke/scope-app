"use client";
import { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useGroups from "../../hooks/useGroups";
import ProfilePicture from "../profile/ProfilePicture";

export default function GroupEditForm({ group, onCancel, onSubmit }) {
    const { updateGroup } = useGroups();

    const validationSchema = Yup.object({
      name: Yup.string().required("Nazwa grupy jest wymagana"),
      description: Yup.string().max(
        140,
        "Opis może zawierać maksymalnie 140 znaków."
      ),
      photo: Yup.string()
        .test("is-valid-photo", "Nieprawidłowy URL zdjęcia", (value) => {
          if (value == null || value == "") return true;
          const urlPattern = /^(https?:\/\/).+/i;
          const dataUrlPattern = /^data:image\/[a-z]+;base64,([A-Za-z0-9+/=]+)$/;
          return urlPattern.test(value) || dataUrlPattern.test(value);
        })
        .nullable(),
    });

    const formik = useFormik({
        initialValues: {
            name: group.name,
            description: group.description,
            photo: group.photo || "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
            updateGroup(group.id, values)
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="p-4 border rounded bg-[#403d39]">
            <h2 className="text-xl font-bold mb-2 text-white">Edytuj Grupę</h2>
            <div className="form-group mb-2">
                <label className="text-white">Zdjęcie grupy:</label>
                <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/jpeg, image/png"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
                        const reader = new FileReader();
                            reader.onload = () => {
                            formik.setFieldValue("photo", reader.result);
                            };
                            reader.readAsDataURL(file);
                        } else {
                           formik.setFieldError("photo", "Akceptowane formaty to JPG i PNG.");
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
            <div className="form-group mb-2">
                <label className="text-white">Nazwa grupy:</label>
                <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2"
                    required
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="alert alert-error">{formik.errors.name}</div>
                  ) : null}
            </div>
            <div className="form-group mb-2">
                <label className="text-white">Opis grupy:</label>
                <textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full p-2"
                    rows="3"
                    maxLength="140"
                ></textarea>
                {formik.touched.description && formik.errors.description ? (
                    <div className="alert alert-error">{formik.errors.description}</div>
                    ) : null}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Zapisz
              </button>
              <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                  Anuluj
              </button>
             </div>
        </form>
    );
}