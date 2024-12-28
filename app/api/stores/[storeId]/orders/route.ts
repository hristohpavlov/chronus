import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function DELETE (
    req: Request,
    { params }: { params: {storeId: string}}
) {
    try {
        const { userId } = await auth();

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if(!params.storeId){
            return new NextResponse("Store id is required", {status: 400});
        }

        const store = await prismadb.order.deleteMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log('[ORDERS_DELETE]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}