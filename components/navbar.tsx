import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import ClientNav from "./client-nav";

const Navbar = async () => {
    const {userId} = auth();

    if(!userId) {
        redirect("/sign-in");
    }

    const stores = await prismadb.store.findMany({
        where: {
            userId
        },
    });
    return (
        <ClientNav stores={stores}/>
    )
}

export default Navbar;