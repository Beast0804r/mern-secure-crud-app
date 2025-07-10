import { React } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import '../../css/App.css';

const Login = ({ setErrMsg, setSuccMsg, onTokenReceive }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/login`, data);
            if (res.status === 200 || res.status === 201) {
                setSuccMsg('Login successfully');
                const { token, user } = res.data;
                onTokenReceive(token, user);
                reset();
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
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <h2>Login</h2>

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
                    {...register("password", { required: "Password is required" })}
                />
                {errors.password && <p className="error">{errors.password.message}</p>}
            </div>

            <button type="submit" className="submit-btn">Login</button>
        </form>
    );
}

export default Login;
