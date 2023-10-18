import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { alertHelper, IAlertObj } from '@/lib/helper/alert';

export function Alert() {
    const router = useRouter();
    const [alert, setAlert] = useState<IAlertObj | null>(null);

    useEffect(() => {
        const subscription = alertHelper.alert.subscribe(alert => setAlert(alert));
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        // clear alert on location change
        alertHelper.clear();
    }, [router]);

    if (!alert) return null;

    console.log(alert)

    return (
        <div className="container">
            <div className="m-3">
                <div className={`alert alert-dismissible ${alert.type}`}>
                    {alert.message}
                    <button type="button" className="btn-close" onClick={() => alertHelper.clear()}></button>
                </div>
            </div>
        </div>
    );
}