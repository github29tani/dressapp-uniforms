import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const fileName = formData.get('fileName') as string
    const objectFit = (formData.get('objectFit') as string) || 'cover'

    if (!file || !productId || !fileName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check for existing image and delete it first
    const { data: existingImages } = await supabase
      .from('product_images')
      .select('id, url')
      .eq('product_id', productId)

    if (existingImages && existingImages.length > 0) {
      // Delete old images from storage
      for (const img of existingImages) {
        // Extract file path from URL
        const urlParts = img.url.split('/product-images/')
        if (urlParts.length > 1) {
          const oldFilePath = urlParts[1]
          await supabase.storage
            .from('product-images')
            .remove([oldFilePath])
        }
      }

      // Delete old database records
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', productId)
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload new image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 400 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    // Insert new product_images record
    const { error: dbError } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        url: publicUrl,
        alt_text: file.name,
        sort_order: 1,
        object_fit: objectFit as "cover" | "contain"
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      message: existingImages && existingImages.length > 0 
        ? 'Image replaced successfully' 
        : 'Image uploaded successfully'
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
