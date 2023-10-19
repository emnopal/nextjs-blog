import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { userService } from '@/services/usersService';
import { alertHelper } from '@/lib/helper/alert';
import { UserValidation } from '@/lib/validation/users';



export function EditUser(props: any) {
    const user = props?.user;
    const disableForms = props?.disableForms ?? true
    const isProfile = props?.isProfile ?? false
    const router = useRouter();

    const validationSchema = UserValidation.EditUser()
    const formOptions = { resolver: yupResolver(validationSchema) } as any;

    // set default form values if in edit mode
    if (user) {
        formOptions.defaultValues = props.user;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    async function onSubmit(data: any) {
        alertHelper.clear();
        try {
            let message;
            await userService.update(user.id, data);
            message = 'User updated';
            router.push('/users');
            alertHelper.success(message, true);
        } catch (error) {
            alertHelper.error(error as string);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="mb-3 col">
                    <label className="form-label">Name</label>
                    <input type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} disabled={disableForms} />
                    <div className="invalid-feedback">{errors.name?.message?.toString()}</div>
                </div>
                <div className="mb-3 col">
                    <label className="form-label">Email</label>
                    <input type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} disabled={disableForms} />
                    <div className="invalid-feedback">{errors.email?.message?.toString()}</div>
                </div>
            </div>
            <div className="row">
                <div className="mb-3 col">
                    <label className="form-label">Username</label>
                    <input type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} disabled={disableForms} />
                    <div className="invalid-feedback">{errors.username?.message?.toString()}</div>
                </div>
            </div>
            <div className="mb-3">
                {!disableForms ?
                    <>
                        <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary me-2">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Save
                        </button>
                        <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-danger">Reset</button>
                    </>
                    :
                    ''
                }
                {isProfile ? '' : <Link href="/users" className="btn btn-link">Back to User List</Link> }
                <Link href="#" className="btn btn-link">Change Password</Link>
            </div>
        </form>
    );
}