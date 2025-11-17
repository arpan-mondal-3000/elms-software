// Library import
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Navigate, Outlet } from "react-router";
import { Oval } from "react-loader-spinner";

// Types import
import { type User } from "../lib/types";

export default function ProtectRoute({ allowedRoles }: { allowedRoles: string[] }) {
    const { user, loading, fetchUser } = useAuthStore();
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            try {
                if (user) {
                    if (allowedRoles && allowedRoles.includes(user.role)) {
                        setRedirect(false);
                        return;
                    }
                    setRedirect(true);
                    return;
                }

                const fetched: User = await fetchUser();
                if (fetched && allowedRoles && allowedRoles.includes(fetched.role)) {
                    setRedirect(false);
                    return;
                }
                setRedirect(true);
            } catch (err) {
                console.error("Failed to fetch user!");
                setRedirect(true);
            }
        }

        checkUser();
    }, [])

    if (loading) return (
        <div className="h-screen w-screen flex items-center justify-center">
            <Oval
                visible={true}
                height="80"
                width="80"
                color="#000814"
                secondaryColor="#bad6ff"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );

    if (redirect) return <Navigate to="/" replace />

    return <Outlet />
}