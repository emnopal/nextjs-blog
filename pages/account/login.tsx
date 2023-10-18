import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Layout } from '@/components/account/Layout';
import { alertHelper } from '@/lib/helper/alert';
import { userService } from '@/services/usersService';
import { UrlObject } from 'url';
import { UserValidation } from '@/lib/validation/users';

interface ILoginOnSubmit {
    username: string
    password: string
}

type Url = UrlObject | string

export default function Login() {
    const router = useRouter();

    // form validation rules
    const validationSchema = UserValidation.Login()
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ username, password }: ILoginOnSubmit) {
        alertHelper.clear();
        return userService.login(username, password)
            .then(() => {
                const returnUrl = router.query.returnUrl || '/';
                router.push(returnUrl as Url);
            })
            .catch(alertHelper.error);
    }

    return (
        <Layout>
            <div className="card">
                <h4 className="card-header" style={{color: 'black'}}>Login</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                            Login
                        </button>
                        <Link href="/account/register" className="btn btn-link">Register</Link>
                    </form>
                </div>
            </div>
        </Layout>
    );
}