import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import '../css/App.css';

const AddUser = ({ onUserAdded, editUser, onUpdateComplete, setLoading, loading, setSuccMsg, setErrMsg }) => {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({ mode: 'onChange' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (editUser) {
      setValue('name', editUser.name);
      setValue('email', editUser.email);
    } else {
      reset();
    }
  }, [editUser, setValue, reset]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccMsg('');
    setErrMsg('');

    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      if (file) formData.append('file', file);

      if (editUser) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/update/${editUser._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccMsg('User updated successfully');
        onUpdateComplete();
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/store`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.status === 201 || res.status === 200) {
          setSuccMsg('User added successfully');
          reset();
          setTimeout(() => {
            onUserAdded();
          }, 200);
        }
      }
    } catch (err) {
      setErrMsg(err.response?.data.message || "Error");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccMsg('');
        setErrMsg('');
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="form-group">
      <div className="form-group">
        <input
          type="text"
          placeholder="Name"
          {...register('name', { required: "Name is required!" })}
        />
        {errors.name && <p className="error">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <input
          type="text"
          placeholder="Email"
          {...register('email', {
            required: "Email is required!",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Email is invalid!"
            },
            validate: async (value) => {
              if (editUser && editUser.email === value) return true;
              try {
                const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/emailUnique/`, { email: value }, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                return res.data.exists ? "Email already exists" : true;
              } catch {
                return "Error validating email";
              }
            }
          })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <input type="file" onChange={handleFileChange} accept="image/*" />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : editUser ? 'Update' : 'Add'}
      </button>
    </form>
  );
};

export default AddUser;
