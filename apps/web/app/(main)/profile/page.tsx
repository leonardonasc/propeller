import { headers } from "next/headers";
import { getUser } from "../../src/services/users";
import Image from "next/image";



export default async function UserProfile() {
    const header = (await headers()).get("cookie") || "";

    const user = await getUser({
        cookie: header,
    });

    const userImage = user.image || "/images/avatar.png";

    return (
        <div className="bg-background text-foreground">
            <div className="mx-auto w-full sm:px-10 lg:px-0">
                <header className="mb-8 flex items-end justify-between gap-6">
                    <div>
                        <p className="mb-1 text-sm font-medium text-blue-400">
                            Perfil
                        </p>
                        <div className="flex items-center gap-x-3 ">
                            <Image
                                src={userImage}
                                alt="Avatar"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {user.name}
                            </h1>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Gerencie suas informações de perfil e preferências.
                        </p>
                    </div>
                </header>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="col-span-2">
                        <div className="mb-4 text-sm font-medium text-blue-400">
                            Informações do usuário
                        </div>
                        <div className="rounded-lg border border-border bg-card p-6">
                            <div className="mb-4">
                                <div className="mb-2 text-sm font-semibold text-foreground">
                                    Nome Completo
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {user.name}
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="mb-2 text-sm font-semibold text-foreground">
                                    Email
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {user.email}
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="mb-2 text-sm font-semibold text-foreground">
                                    Criado em
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 text-sm font-semibold text-foreground">
                                    Última atualização
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(user.updatedAt).toLocaleDateString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}