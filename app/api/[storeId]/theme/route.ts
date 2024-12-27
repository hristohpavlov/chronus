import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
 
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();

    const body = await req.json();

    const { primaryColor, yoloColor, borderColor, inputColor, ringColor, backgroundColor, foregroundColor } = body;

    if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!primaryColor) {
        return new NextResponse("primaryColor is required", { status: 400 });
    }

    if (!yoloColor) {
        return new NextResponse("yoloColor is required", { status: 400 });
    }

    if (!borderColor) {
        return new NextResponse("borderColor is required", { status: 400 });
    }

    if (!inputColor) {
        return new NextResponse("inputColor is required", { status: 400 });
    }

    if (!ringColor) {
        return new NextResponse("ringColor is required", { status: 400 });
    }

    if (!backgroundColor) {
        return new NextResponse("backgroundColor is required", { status: 400 });
    }

    if (!foregroundColor) {
        return new NextResponse("foregroundColor is required", { status: 400 });
    }
  

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.themeColors.findFirst({
      where: {
        storeId: params.storeId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const color = await prismadb.themeColors.create({
      data: {
        primaryColor,
        yoloColor,
        borderColor,
        inputColor,
        ringColor,
        backgroundColor,
        foregroundColor,
        storeId: params.storeId
      }
    });
  
    return NextResponse.json(color);
  } catch (error) {
    console.log('[THEME_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const colors = await prismadb.themeColors.findMany({
      where: {
        storeId: params.storeId
      }
    });
  
    return NextResponse.json(colors);
  } catch (error) {
    console.log('[THEME_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string } }
  ) {
    try {
      const { userId } = await auth();
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: params.storeId,
          userId
        }
      });
  
      if (!storeByUserId) {
        return new NextResponse("Unauthorized", { status: 405 });
      }

        const getTheme = await prismadb.themeColors.findFirst({
            where : {
                storeId: params.storeId
            }
        })
  
      const theme = await prismadb.themeColors.delete({
        where: {
            id: getTheme!.id,
            storeId: params.storeId
        }
      });
    
      return NextResponse.json(theme);
    } catch (error) {
      console.log('[THEME_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };

  export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string } }
  ) {
    try {
        const { userId } = await auth();

        const body = await req.json();
    
        const { primaryColor, yoloColor, borderColor, inputColor, ringColor, backgroundColor, foregroundColor } = body;
    
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }
    
        if (!primaryColor) {
            return new NextResponse("primaryColor is required", { status: 400 });
        }
    
        if (!yoloColor) {
            return new NextResponse("yoloColor is required", { status: 400 });
        }
    
        if (!borderColor) {
            return new NextResponse("borderColor is required", { status: 400 });
        }
    
        if (!inputColor) {
            return new NextResponse("inputColor is required", { status: 400 });
        }
    
        if (!ringColor) {
            return new NextResponse("ringColor is required", { status: 400 });
        }
    
        if (!backgroundColor) {
            return new NextResponse("backgroundColor is required", { status: 400 });
        }
    
        if (!foregroundColor) {
            return new NextResponse("foregroundColor is required", { status: 400 });
        }
  
      const storeByUserId = await prismadb.store.findFirst({
        where: {
          id: params.storeId,
          userId
        }
      });
  
      if (!storeByUserId) {
        return new NextResponse("Unauthorized", { status: 405 });
      }
  
      const getTheme = await prismadb.themeColors.findFirst({
        where : {
            storeId: params.storeId
        }
        })

        const theme = await prismadb.themeColors.update({
            where: {
                id: getTheme!.id,
                storeId: params.storeId
            }, data: {
                primaryColor,
                yoloColor,
                borderColor,
                inputColor,
                ringColor,
                backgroundColor,
                foregroundColor
              }
        });
    
      return NextResponse.json(theme);
    } catch (error) {
      console.log('[COLOR_PATCH]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };