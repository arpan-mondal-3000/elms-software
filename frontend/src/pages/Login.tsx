// Images
import Banner from "../assets/auth_banner.png"

// Library
import { useState } from "react"
import { useAuthStore } from "../store/authStore"
import { useNavigate } from "react-router"

// Types
import { type User } from "../lib/types"

// Components
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "../components/ui/field"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button";
import { toast } from "sonner"
import { Oval } from "react-loader-spinner";
import { AxiosError } from "axios"

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (email.trim() !== "" && password.trim() !== "") {
            try {
                const user: User = await login(email, password);
                if (user) {
                    toast.success("Logged in successfully.");
                    if (user.role === "employee") navigate("/employee");
                    else if (user.role === "admin") navigate("/admin");
                    else throw new Error("Not a valid role!");
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    const message = err?.response?.data.message;
                    console.log(err, message);
                    toast.error(`Failed to login please try again. ${message}`);
                }
            }
        }
    }

    return (
        <>
            <div className="md:grid md:grid-cols-2 h-screen items-center">
                {/* Left section */}
                <div className="hidden md:block">
                    <img src={Banner} alt="Login Banner" />
                </div>
                {/* Login form */}
                <div className="flex items-center justify-center bg-muted h-full">
                    <form className="w-3/4 shadow-lg p-10 rounded-lg bg-background">
                        {loading ?
                            <div className="flex items-center justify-center">
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
                            :
                            <FieldGroup>
                                <FieldSet>
                                    <FieldLegend>Login</FieldLegend>
                                    <FieldDescription>Login to your organization</FieldDescription>
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel>Email</FieldLabel>
                                            <Input
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel>Password</FieldLabel>
                                            <Input
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </Field>
                                        <Field>
                                            <Button onClick={handleLogin}>
                                                Login
                                            </Button>
                                        </Field>
                                    </FieldGroup>
                                </FieldSet>
                            </FieldGroup>}
                    </form>
                </div>
            </div>
        </>
    )
}