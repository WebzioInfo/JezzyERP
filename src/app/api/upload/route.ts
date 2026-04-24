import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { verifySessionVerified } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const session = await verifySessionVerified();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert to base64 for Cloudinary upload utility
    const base64Content = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    const result = await uploadToCloudinary(base64Content, 'jezzy_ewaybills');

    return NextResponse.json({ 
      url: result.secure_url,
      publicId: result.public_id 
    });

  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error',
      details: error.response?.data || error.stack
    }, { status: 500 });
  }
}
