import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function POST(req: Request, { params }: { params: {storeId: string}}) {
    try {
        const { userId } = auth();
        const  body = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401});
        }


        const landing = await prismadb.landing.create({
            data: {
                storeId: params.storeId,
                decodeTitle: 'Example',
                mainTitle: 'Example',
                secondTitle: 'Example',
            }
        });

        return NextResponse.json(landing);
    } catch (error){
        console.log("[STORES_POST]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string}}
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { decodeTitle, mainTitle, secondTitle } = body;
        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401});
        }
        if(!decodeTitle){
            return new NextResponse("decodeTitle is required", {status:400});
        }
        if(!mainTitle){
            return new NextResponse("mainTitle is required", {status:400});
        }
        if(!secondTitle){
            return new NextResponse("secondTitle is required", {status:400});
        }
        if(!params.storeId){
            return new NextResponse("Store id is required", {status: 400});
        }

        const store = await prismadb.landing.updateMany({
            where: {
                storeId: params.storeId,
            },
            data: {
                decodeTitle,
                mainTitle,
                secondTitle
            }
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log('[LANDING_PATCH]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}

export async function GET (
    req: Request,
    { params }: { params: {storeId: string}}
) {
    try {
        if(!params.storeId){
            return new NextResponse("storeId id is required", {status: 400});
        }
        const store = await prismadb.landing.findFirst({
            where: {
                storeId: params.storeId,
            }
        });
        return NextResponse.json(store);
    } catch (error) {
        console.log('[LANDING_GET]', error);
        return new NextResponse("Internal error", {status: 500});
    }
}