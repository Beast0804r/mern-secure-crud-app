import { React } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import '../../css/App.css';


const Register = ({ onRegister, setErrMsg, setSuccMsg, setPage }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/register`, data);
            if (res.status === 201 || res.status === 200) {
                setSuccMsg('User Added successfully');
                setPage('login');
                reset();
                setTimeout(() => {
                    onRegister();
                }, 200);
            }
        } catch (err) {
            setErrMsg(err.response?.data.message || "Error");
        } finally {
            setTimeout(() => {
                setSuccMsg('');
                setErrMsg('');
            }, 3000);
        }
    };

    return (
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
            <h2>Register</h2>

            <div className="form-group">
                <input
                    type="text"
                    placeholder="Name"
                    {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="error">{errors.name.message}</p>}
            </div>

            <div className="form-group">
                <input
                    type="email"
                    placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Min 6 characters" }
                    })}
                />
                {errors.password && <p className="error">{errors.password.message}</p>}
            </div>

            <button className="submit-btn" type="submit">Register</button>
        </form>
    );
};

export default Register;
