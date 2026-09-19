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

    if (!file || !productId || !fileName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage using service role (bypasses RLS)
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

    // Update product_images table
    const { error: dbError } = await supabase
      .from('product_images')
      .upsert({
        product_id: productId,
        url: publicUrl,
        alt_text: file.name,
        sort_order: 1
      })

    if (dbError) {
      console.error('Database error:', dbError)
      
      // If upsert fails, try insert or update separately
      const { data: existing } = await supabase
        .from('product_images')
        .select('id')
        .eq('product_id', productId)
        .eq('sort_order', 1)
        .single()

      if (existing) {
        // Update existing
        const { error: updateError } = await supabase
          .from('product_images')
          .update({ url: publicUrl, alt_text: file.name })
          .eq('product_id', productId)
          .eq('sort_order', 1)
        
        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 400 })
        }
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            url: publicUrl,
            alt_text: file.name,
            sort_order: 1
          })
        
        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: 400 })
        }
      }
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
