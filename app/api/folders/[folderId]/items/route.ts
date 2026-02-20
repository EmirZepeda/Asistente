import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ folderId: string }> }
) {
    try {
        const { folderId } = await params;
        const items = await prisma.item.findMany({
            where: {
                folderId: folderId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch items' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ folderId: string }> }
) {
    try {
        const { folderId } = await params;
        const contentType = request.headers.get('content-type') ?? '';

        let type = '';
        let title = '';
        let description = '';
        let content = '';
        let fileUrl = '';
        let size = '';
        let duration = '';

        if (contentType.includes('application/json')) {
            // Text notes sent as JSON
            const body = await request.json();
            type = body.type;
            title = body.title;
            description = body.description ?? '';
            content = body.content ?? '';
            if (content) {
                const bytes = new TextEncoder().encode(content).length;
                size = `${(bytes / 1024).toFixed(1)} KB`;
            }
        } else {
            // Files sent as multipart/form-data
            const formData = await request.formData();
            type = formData.get('type') as string;
            title = formData.get('title') as string;
            description = (formData.get('description') as string) ?? '';

            if (type === 'note') {
                content = formData.get('content') as string;
                const bytes = new TextEncoder().encode(content).length;
                size = `${(bytes / 1024).toFixed(1)} KB`;
            } else if (['photo', 'scan', 'voice'].includes(type)) {
                const file = formData.get('file') as File;
                if (file) {
                    const buffer = Buffer.from(await file.arrayBuffer());
                    const filename = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;
                    const uploadDir = path.join(process.cwd(), 'public/uploads');
                    await mkdir(uploadDir, { recursive: true });
                    await writeFile(path.join(uploadDir, filename), buffer);
                    fileUrl = `/uploads/${filename}`;

                    const fileSizeInBytes = file.size;
                    size = fileSizeInBytes > 1024 * 1024
                        ? `${(fileSizeInBytes / (1024 * 1024)).toFixed(1)} MB`
                        : `${(fileSizeInBytes / 1024).toFixed(1)} KB`;

                    if (type === 'voice') {
                        duration = (formData.get('duration') as string) || '';
                    }
                }
            }
        }

        const newItem = await prisma.item.create({
            data: {
                type,
                title: title || `Nuevo ${type}`,
                description: description || '',
                content: content || null,
                fileUrl: fileUrl || null,
                fileSize: size || null,
                duration: duration || null,
                folderId: folderId,
                encrypted: true
            }
        });

        return NextResponse.json(newItem);

    } catch (error) {
        console.error('Error creating item:', error);
        return NextResponse.json(
            { error: 'Error al guardar el elemento' },
            { status: 500 }
        );
    }
}
