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

    // Get existing images count to determine sort_order
    const { data: existingImages, count } = await supabase
      .from('product_images')
      .select('id', { count: 'exact' })
      .eq('product_id', productId)

    const nextSortOrder = (count || 0) + 1

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload new image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
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
        sort_order: nextSortOrder,
        object_fit: objectFit as "cover" | "contain"
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      message: 'Image uploaded successfully'
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
