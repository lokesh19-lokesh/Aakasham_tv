import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, data } = await req.json()

    if (action === 'create-article') {
      const { title, content, image_url, video_url, category_id, district_id, is_hero_slider, is_top_hero, whatsapp_link } = data
      
      const { data: article, error } = await supabaseClient
        .from('articles')
        .insert([{ 
          title, 
          content, 
          image_url, 
          video_url, 
          category_id, 
          district_id, 
          is_hero_slider,
          is_top_hero,
          whatsapp_link 
        }])
        .select()

      if (error) throw error
      return new Response(JSON.stringify(article), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'update-article') {
      const { id, title, content, image_url, video_url, category_id, district_id, is_hero_slider, is_top_hero, whatsapp_link } = data
      
      const { data: article, error } = await supabaseClient
        .from('articles')
        .update({ 
          title, 
          content, 
          image_url, 
          video_url, 
          category_id: category_id ? parseInt(category_id) : null, 
          district_id: district_id ? parseInt(district_id) : null, 
          is_hero_slider,
          is_top_hero,
          whatsapp_link 
        })
        .eq('id', id)
        .select()

      if (error) throw error
      return new Response(JSON.stringify(article), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'get-articles') {
      const { category_slug, district_name, limit = 10 } = data
      let query = supabaseClient.from('articles').select('*, categories(*), districts(*)')

      if (category_slug) {
        query = query.eq('categories.slug', category_slug)
      }
      if (district_name) {
        query = query.eq('districts.name', district_name)
      }

      const { data: articles, error } = await query.order('created_at', { ascending: false }).limit(limit)

      if (error) throw error
      return new Response(JSON.stringify(articles), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ error: 'Action not found' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
