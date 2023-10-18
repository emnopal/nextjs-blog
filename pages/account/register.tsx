import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Layout } from '@/components/account/Layout';
import { alertHelper } from '@/lib/helper/alert';
import { userService } from '@/services/usersService';
import { UserValidation } from '@/lib/validation/users';

export default function Register() {
    const router = useRouter();

    const validationSchema = UserValidation.Register();
    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(user: any) {
        return userService.register(user)
            .then(() => {
                alertHelper.success('Registration successful', true);
                router.push('login');
            })
            .catch(alertHelper.error);
    }

    return (
        <Layout>
            <div className="card">
                <h4 className="card-header" style={{color: 'black'}}>Register</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label className="form-label" style={{color: 'black'}}>Name</label>
                            <input type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.name?.message}</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label" style={{color: 'black'}}>Email</label>
                            <input type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label" style={{color: 'black'}}>Username</label>
                            <input type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label" style={{color: 'black'}}>Password</label>
                            <input type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Register
                        </button>
                        <Link href="/account/login" className="btn btn-link">Cancel</Link>
                    </form>
                </div>
            </div>
        </Layout>
    );
}