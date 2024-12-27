import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request,) {
    try {
        const { userId } = await auth();
        const  body = await req.json();

        const { name } = body;
        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!name){
            return new NextResponse("Name is required", {status: 400});
        }

        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });

        const getStore = await prismadb.store.findFirst({
            where: {
                name: store.name
            }
        })

        await prismadb.landing.create({
            data: {
                storeId: getStore!.id,
                decodeTitle: 'Example',
                mainTitle: 'Example',
                secondTitle: 'Example',
            }
        });

        await prismadb.themeColors.create({
            data: {
                storeId: getStore!.id,
                primaryColor: '#FFFFFF',
                yoloColor: '#FFFFFF',
                borderColor: '#FFFFFF',
                inputColor: '#FFFFFF',
                ringColor: '#FFFFFF',
                backgroundColor: '#FFFFFF',
                foregroundColor: '#FFFFFF',
            }
        });

        return NextResponse.json(store);
    } catch (error){
        console.log("[STORES_POST]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}