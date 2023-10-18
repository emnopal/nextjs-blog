import { BehaviorSubject } from "rxjs";

export interface IAlertObj {
    type?: string,
    message?: string,
    showAfterRedirect?: boolean
}

const alertSubject = new BehaviorSubject<IAlertObj | null>(null);

function success(message: string, showAfterRedirect: boolean = false): void {
    alertSubject.next({
        type: 'alert-success',
        message,
        showAfterRedirect
    })
}

function error(message: string, showAfterRedirect: boolean = false): void {
    alertSubject.next({
        type: 'alert-danger',
        message,
        showAfterRedirect
    })
}

function clear() {
    let alert = alertSubject.value;
    if (alert?.showAfterRedirect) {
        alert.showAfterRedirect = false;
    } else {
        alert = null;
    }
    alertSubject.next(alert);
}

export const alertHelper = {
    alert: alertSubject.asObservable(),
    success,
    error,
    clear
};