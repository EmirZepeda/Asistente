import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') ?? 'active';

        const folders = await (prisma.folder.findMany as any)({
            where: { status },
            include: {
                _count: { select: { items: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(folders);
    } catch (error) {
        console.error('Error fetching folders:', error);
        return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, folderType, securityLevel } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'El nombre de la carpeta es requerido' },
                { status: 400 }
            );
        }

        const newFolder = await (prisma.folder.create as any)({
            data: {
                name,
                folderType: folderType ?? 'privado',
                securityLevel: securityLevel ?? 'enhanced',
                status: 'active',
            }
        });

        return NextResponse.json(newFolder);
    } catch (error) {
        console.error('Error creating folder:', error);
        return NextResponse.json(
            { error: 'Error al crear la carpeta' },
            { status: 500 }
        );
    }
}
