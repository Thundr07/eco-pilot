import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, energyUsage, waterUsage, wasteGeneration, transportation, dietType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing sustainability analysis for:', name);

    const systemPrompt = `You are an AI sustainability expert. Analyze the user's lifestyle data and provide:
1. An eco-score (0-100, where 100 is most sustainable)
2. 3-5 specific, actionable recommendations to improve sustainability
3. Estimated environmental impact metrics

Be encouraging but honest. Focus on practical, achievable changes.`;

    const userPrompt = `Analyze this lifestyle data:
- Energy Usage: ${energyUsage} kWh/month
- Water Usage: ${waterUsage} gallons/month
- Waste Generation: ${wasteGeneration} lbs/week
- Transportation: ${transportation}
- Diet Type: ${dietType}

Provide a structured response with:
1. Eco-score (0-100)
2. Key sustainability insights
3. Specific recommendations
4. Estimated carbon footprint`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Analysis complete');

    // Parse the AI response to extract structured data
    const ecoScoreMatch = aiResponse.match(/eco[-\s]?score[:\s]+(\d+)/i);
    const ecoScore = ecoScoreMatch ? parseInt(ecoScoreMatch[1]) : 50;

    return new Response(
      JSON.stringify({
        ecoScore,
        analysis: aiResponse,
        recommendations: aiResponse,
        inputData: {
          name,
          energyUsage,
          waterUsage,
          wasteGeneration,
          transportation,
          dietType
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-sustainability function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});