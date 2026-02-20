import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ folderId: string; itemId: string }> }
) {
    try {
        const { itemId } = await params;

        await prisma.item.delete({
            where: { id: itemId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting item:', error);
        return NextResponse.json(
            { error: 'Error al eliminar el elemento' },
            { status: 500 }
        );
    }
}
