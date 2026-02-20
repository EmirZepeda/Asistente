import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH /api/folders/[folderId] - update folder status (active, hidden, archived, deleted)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ folderId: string }> }
) {
    try {
        const { folderId } = await params;
        const body = await request.json();
        const { status } = body;

        const validStatuses = ['active', 'hidden', 'archived', 'deleted'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
        }

        const updated = await (prisma.folder.update as any)({
            where: { id: folderId },
            data: { status }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating folder:', error);
        return NextResponse.json({ error: 'Error al actualizar la carpeta' }, { status: 500 });
    }
}

// DELETE /api/folders/[folderId] - permanently delete folder
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ folderId: string }> }
) {
    try {
        const { folderId } = await params;
        await prisma.folder.delete({ where: { id: folderId } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting folder:', error);
        return NextResponse.json({ error: 'Error al eliminar la carpeta' }, { status: 500 });
    }
}
