import { useEffect, useState } from "react";

export function Footer(): JSX.Element {

    const [year, setYear] = useState(0)

    useEffect(() => {
        const getYear = new Date().getFullYear();
        setYear(getYear)
    }, [])

    return (
        <footer className="footer">
            <div className="container text-center" style={{paddingTop: '30px'}}>
                <p>&copy; {year} by BadHabit</p>
            </div>
        </footer>
    );
}