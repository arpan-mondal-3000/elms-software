// Images
import Banner from "../assets/auth_banner.png"

// Library
import { useState } from "react"

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

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        alert("You have logged in.");
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
                        </FieldGroup>
                    </form>
                </div>
            </div>
        </>
    )
}